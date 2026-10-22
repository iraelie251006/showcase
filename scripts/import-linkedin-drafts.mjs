import { MongoClient, ObjectId, Binary } from 'mongodb';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { articles } from '../content/imports/linkedin-articles/articles.mjs';
import { validateArticle, contentText } from '../lib/blog/content.mjs';

const dryRun = !process.argv.includes('--write');
const directory = path.resolve('content/imports/linkedin-articles/images');
// A dry run validates all content and images without accessing Atlas.
for (const article of articles) {
  const body = JSON.parse(JSON.stringify(article.content).replaceAll(`asset:${article.image}`, '/api/media/0123456789abcdef01234567'));
  validateArticle({...article,tags:article.tags.join(', '),cover:'/api/media/0123456789abcdef01234567',coverAlt:article.alt,content:body});
  const info = await sharp(await readFile(path.join(directory,article.image))).metadata();
  if (!info.width || !info.height) throw new Error(`Invalid image: ${article.image}`);
  console.log(`${dryRun?'Validated':'Prepared'}: ${article.slug} (${contentText(body).split(/\s+/).length} words)`);
}
if (dryRun) {
  console.log('Dry run complete. Use npm run blog:import-linkedin -- --write to add private drafts.');
  process.exit(0);
}
if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
  console.error('Set MONGODB_URI and MONGODB_DB in .env.local before importing.');
  process.exit(1);
}
const client = new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const posts = db.collection('blog_posts');
  await posts.createIndex({'draft.slug':1},{unique:true});
  let created=0, skipped=0;
  for (const source of articles) {
    // Never overwrite a draft or published article, even after the user edits it.
    const importKey = `linkedin-case-studies-v1:${source.slug}`;
    if (await posts.findOne({$or:[{importKey},{'draft.slug':source.slug},{'published.slug':source.slug}]})) {
      console.log(`Skipped existing article: ${source.slug}`); skipped++; continue;
    }
    const id = new ObjectId();
    const imageId = new ObjectId();
    const url = `/api/media/${imageId.toHexString()}`;
    const content = JSON.parse(JSON.stringify(source.content).replaceAll(`asset:${source.image}`,url));
    const draft = validateArticle({...source, tags:source.tags.join(', '),cover:url,coverAlt:source.alt,content});
    const data = await sharp(await readFile(path.join(directory,source.image)),{limitInputPixels:20000000}).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toBuffer();
    await db.collection('blog_media').insertOne({_id:imageId,postId:id,data:new Binary(data),createdAt:new Date()});
    try {
      await posts.insertOne({_id:id,importKey,draft,published:null,publishedAt:null,updatedAt:new Date(),revision:0,assetIds:[]});
    } catch (error) {
      // This image was created by this run and has not been attached to any post.
      await db.collection('blog_media').deleteOne({_id:imageId,postId:id});
      throw error;
    }
    created++;
    console.log(`Created private draft: /admin/posts/${id.toHexString()}`);
  }
  console.log(`Finished: ${created} drafts created, ${skipped} existing articles preserved. Nothing was published.`);
} catch {
  console.error('Import stopped. Check Atlas access and run again; previously imported drafts are preserved and skipped.');
  process.exitCode=1;
} finally {await client.close();}
