/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminPost } from '@/lib/blog/store';
import ArticleContent from '@/components/blog/ArticleContent';

export default async function PreviewPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();
  const article = post.draft;
  return <main className="relative z-10 mx-auto max-w-3xl px-5 py-24">
    <div className="mb-8 rounded-xl border border-purple/40 bg-purple/10 p-4 text-sm">Private preview of your last saved draft. <Link className="text-purple underline" href={`/admin/posts/${id}`}>Back to editor</Link></div>
    {article.cover && <img className="mb-8 aspect-video w-full rounded-2xl object-cover" src={article.cover} alt={article.coverAlt} />}
    <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
    <p className="mb-10 text-lg text-muted-foreground">{article.description}</p>
    <ArticleContent content={article.content} />
  </main>;
}
