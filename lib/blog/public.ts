import 'server-only';
import { cache } from 'react';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { isDatabaseConfigured } from '@/lib/mongodb';
import { postsCollection, publicPost } from './store';

export async function getPublicPosts() {
  const legacy = getAllPosts().map(post => ({ ...post, cover: '', coverAlt: '' }));
  if (!isDatabaseConfigured()) return legacy;
  const records = await (await postsCollection()).find({ published: { $ne: null } }, { projection: { published: 1, publishedAt: 1 } }).sort({ publishedAt: -1 }).toArray();
  return [...records.map(publicPost), ...legacy].sort((a,b) => b.date.localeCompare(a.date));
}
export const getPublicPost = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return null;
  if (isDatabaseConfigured()) {
    const record = await (await postsCollection()).findOne({ 'published.slug': slug, published: { $ne: null } });
    if (record) return publicPost(record);
  }
  const legacy = getPostBySlug(slug);
  return legacy ? { ...legacy, cover: '', coverAlt: '', format: 'mdx' as const } : null;
});
