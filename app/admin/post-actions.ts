'use server';

import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { createDraft, getAdminPost, postsCollection } from '@/lib/blog/store';
import { validateArticle, contentText, imageIds } from '@/lib/blog/content.mjs';
import { getDatabase } from '@/lib/mongodb';
import { getAllPostSlugs } from '@/lib/posts';

export async function newPost() {
  await requireAdmin();
  const id = await createDraft();
  redirect(`/admin/posts/${id}`);
}
export async function savePost(id: string, revision: number, raw: unknown, intent: 'save' | 'publish' | 'unpublish') {
  await requireAdmin();
  if (!['save', 'publish', 'unpublish'].includes(intent)) return { error: 'Invalid action.' };
  try {
    const existing = await getAdminPost(id);
    if (!existing) return { error: 'Article not found.' };
    if (JSON.stringify(raw).length > 600000) return { error: 'Article content is too large.' };
    const draft = validateArticle(raw);
    if (getAllPostSlugs().includes(draft.slug)) return { error: 'That slug is used by an existing article. Choose another.' };
    // Once public, keep the URL stable so existing shared links keep working.
    if (existing.publishedAt && existing.draft.slug !== draft.slug) return { error: 'The URL of a previously published article cannot be changed.' };
    if (intent === 'publish' && !contentText(draft.content)) return { error: 'Write some article text before publishing.' };
    const ids = imageIds(draft.content, draft.cover) as string[];
    const db = await getDatabase();
    if (ids.length && await db.collection('blog_media').countDocuments({ _id: { $in: ids.map(x => new ObjectId(x)) }, postId: existing._id }) !== ids.length) return { error: 'One or more images are unavailable. Upload them to this article again.' };
    const changes = intent === 'publish'
      ? { published: draft, publishedAt: existing.publishedAt ?? new Date(), assetIds: ids }
      : intent === 'unpublish' ? { published: null, assetIds: [] } : {};
    const result = await (await postsCollection()).updateOne({ _id: existing._id, revision }, {
      $set: { draft, updatedAt: new Date(), ...changes }, $inc: { revision: 1 },
    });
    if (!result.matchedCount) return { error: 'This article changed in another tab. Copy your unsaved text, then reload before saving.' };
    revalidatePath('/blog'); revalidatePath(`/blog/${draft.slug}`); revalidatePath('/admin');
    return { revision: revision + 1, published: intent === 'publish' ? true : intent === 'unpublish' ? false : Boolean(existing.published), updatedAt: new Date().toISOString() };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) return { error: 'That URL slug is already used. Choose another.' };
    if (error instanceof SyntaxError) return { error: 'The article content could not be read.' };
    if (error instanceof Error && !error.name.startsWith('Mongo')) return { error: error.message };
    return { error: 'Could not save the article. Your text is still in the editor; please try again.' };
  }
}
