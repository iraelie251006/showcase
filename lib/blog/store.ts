import 'server-only';
import { Binary, ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { contentText, emptyContent } from './content.mjs';
import type { JSONContent } from '@tiptap/react';

export type Article = { title: string; slug: string; description: string; tags: string[]; cover: string; coverAlt: string; content: JSONContent };
export type BlogPost = { _id: ObjectId; draft: Article; published: Article | null; publishedAt: Date | null; updatedAt: Date; revision: number; assetIds: string[] };
export type Media = { _id: ObjectId; postId: ObjectId; data: Binary; createdAt: Date };
export async function postsCollection() {
  const db = await getDatabase();
  const posts = db.collection<BlogPost>('blog_posts');
  await posts.createIndex({ 'draft.slug': 1 }, { unique: true });
  return posts;
}
export async function createDraft() {
  const posts = await postsCollection();
  const id = new ObjectId();
  await posts.insertOne({ _id: id, draft: { title: 'Untitled article', slug: `article-${id.toHexString()}`, description: '', tags: [], cover: '', coverAlt: '', content: emptyContent }, published: null, publishedAt: null, updatedAt: new Date(), revision: 0, assetIds: [] });
  return id.toHexString();
}
export async function getAdminPost(id: string) {
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  return (await postsCollection()).findOne({ _id: new ObjectId(id) });
}
export function serializePost(post: BlogPost) {
  return { id: post._id.toHexString(), draft: post.draft, published: Boolean(post.published), publishedAt: post.publishedAt?.toISOString() ?? null, revision: post.revision, updatedAt: post.updatedAt.toISOString() };
}
export function publicPost(post: BlogPost) {
  const article = post.published!;
  const words = contentText(article.content).split(/\s+/).filter(Boolean).length;
  return { ...article, date: post.publishedAt!.toISOString(), readingMinutes: Math.max(1, Math.ceil(words / 220)), format: 'rich' as const };
}
