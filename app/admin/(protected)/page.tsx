import Link from 'next/link';
import { BookOpen, LogOut, ShieldCheck } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { logout } from '../actions';

export default async function AdminHome() {
  const admin = await requireAdmin();
  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-5 py-24">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-border pb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Portfolio</Link>
        <form action={logout}><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button></form>
      </header>
      <div className="mt-12 flex items-center gap-2 text-sm text-purple"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Private workspace</div>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Welcome back, Elie.</h1>
      <p className="mt-4 text-muted-foreground">Signed in as {admin.email}</p>
      <section className="mt-10 rounded-2xl border border-border bg-card p-8">
        <BookOpen className="mb-5 h-7 w-7 text-purple" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Your publishing space</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">Your private admin access is ready. The article editor, drafts, and image uploads will be added here next.</p>
        <Link href="/blog" className="mt-6 inline-block text-sm font-medium text-purple hover:underline">View public blog →</Link>
      </section>
    </main>
  );
}
