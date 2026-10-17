import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminPost, serializePost } from '@/lib/blog/store';
import PostEditor from '@/components/admin/PostEditor';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();
  return <PostEditor post={serializePost(post)} />;
}
