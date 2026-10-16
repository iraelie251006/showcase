import { ObjectId } from 'mongodb';
import { getDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { getAdminSession } from '@/lib/auth/admin';
import type { Media, BlogPost } from '@/lib/blog/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id) || !isDatabaseConfigured()) return new Response(null, { status: 404 });
  try {
    const db = await getDatabase();
    const media = await db.collection<Media>('blog_media').findOne({ _id: new ObjectId(id) });
    if (!media) return new Response(null, { status: 404 });
    const publicReference = await db.collection<BlogPost>('blog_posts').findOne({ _id: media.postId, published: { $ne: null }, assetIds: id }, { projection: { _id: 1 } });
    if (!publicReference && !(await getAdminSession())) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(media.data.buffer), { headers: {
      'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store', 'Vary': 'Cookie',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    } });
  } catch { return new Response(null, { status: 503 }); }
}
