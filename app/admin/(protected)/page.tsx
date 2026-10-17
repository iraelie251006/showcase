import Link from 'next/link';
import { BookOpen, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { postsCollection } from '@/lib/blog/store';
import { logout } from '../actions';
import { newPost } from '../post-actions';

export default async function AdminHome() {
  const admin = await requireAdmin();
  const posts = await (await postsCollection()).find({}, {projection: { draft: { title: 1, slug: 1 }, published: { title: 1 }, updatedAt: 1 }}).sort({ updatedAt: -1 }).toArray();
  const published = posts.filter(post => post.published).length;
  return <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-5 py-24">
    <header className="flex flex-wrap items-center justify-between gap-5 border-b border-border pb-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Portfolio</Link>
      <div className="flex items-center gap-4"><Link href="/blog" className="text-sm text-purple">View blog ↗</Link><form action={logout}><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button></form></div>
    </header>
    <div className="mt-12 flex items-center gap-2 text-sm text-purple"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Private workspace</div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-6"><div><h1 className="font-display text-3xl font-semibold sm:text-4xl">Your stories.</h1><p className="mt-4 text-muted-foreground">{published} published · {posts.length - published} drafts · {admin.email}</p></div><form action={newPost}><button className="inline-flex items-center gap-2 rounded-lg bg-purple px-5 py-3 font-medium text-white dark:text-black-100"><Plus className="h-4 w-4" aria-hidden="true" />New article</button></form></div>
    {posts.length === 0 ? <section className="mt-10 rounded-2xl border border-border bg-card p-10 text-center"><BookOpen className="mx-auto mb-5 h-8 w-8 text-purple" aria-hidden="true" /><h2 className="text-xl font-semibold">A space for what you build.</h2><p className="mt-3 text-muted-foreground">Create your first article. Start with a draft and publish when it’s ready.</p></section> : <ul className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">{posts.map(post => <li key={post._id.toHexString()}><Link className="flex flex-wrap items-center justify-between gap-4 p-6 transition-colors hover:bg-muted/40" href={`/admin/posts/${post._id.toHexString()}`}><div><h2 className="text-lg font-semibold">{post.draft.title}</h2><p className="mt-2 text-xs text-muted-foreground">Edited {post.updatedAt.toLocaleDateString('en-GB', {timeZone:'Africa/Kigali', day:'numeric', month:'short', year:'numeric'})} · /blog/{post.draft.slug}</p></div><span className="rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-xs text-purple">{post.published ? 'Published' : 'Draft'} →</span></Link></li>)}</ul>}
    <p className="mt-6 text-xs text-muted-foreground">Existing file-based articles remain on your public blog. New articles are managed here.</p>
  </main>;
}
