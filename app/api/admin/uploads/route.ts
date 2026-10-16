import { NextRequest, NextResponse } from 'next/server';
import { Binary } from 'mongodb';
import sharp from 'sharp';
import { getAdminSession } from '@/lib/auth/admin';
import { getAdminPost } from '@/lib/blog/store';
import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';
const MAX = 3 * 1024 * 1024;
export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    const post = await getAdminPost(request.nextUrl.searchParams.get('postId') ?? '');
    if (!post) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(request.headers.get('content-type') ?? '')) return NextResponse.json({ error: 'Choose a JPEG, PNG, or WebP image.' }, { status: 415 });
    if (Number(request.headers.get('content-length')) > MAX) return NextResponse.json({ error: 'Images must be under 3 MB.' }, { status: 413 });
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'No image received.' }, { status: 400 });
    const parts: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX) { await reader.cancel(); return NextResponse.json({ error: 'Images must be under 3 MB.' }, { status: 413 }); }
      parts.push(value);
    }
    let data: Buffer;
    try {
      // Decode and re-encode: never serve uploaded HTML/SVG or arbitrary bytes.
      data = await sharp(Buffer.concat(parts), { limitInputPixels: 20000000, animated: false }).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch { return NextResponse.json({ error: 'This image could not be read. Use a JPEG, PNG, or WebP under 20 megapixels.' }, { status: 400 }); }
    const db = await getDatabase();
    // Per-article limit keeps accidental repeated uploads from filling Atlas.
    if (await db.collection('blog_media').countDocuments({ postId: post._id }) >= 50) return NextResponse.json({ error: 'This article has reached its 50-image upload limit.' }, { status: 400 });
    const result = await db.collection('blog_media').insertOne({ postId: post._id, data: new Binary(data), createdAt: new Date() });
    return NextResponse.json({ url: `/api/media/${result.insertedId.toHexString()}` });
  } catch { return NextResponse.json({ error: 'Upload unavailable. Please try again.' }, { status: 503 }); }
}
