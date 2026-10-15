import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { getAdminSession } from '@/lib/auth/admin';
import { isDatabaseConfigured } from '@/lib/mongodb';
import LoginForm from './LoginForm';

export default async function AdminLogin() {
  if (await getAdminSession()) redirect('/admin');
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to portfolio</Link>
        <section className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-xl shadow-purple/5 sm:p-10">
          <div className="mb-6 inline-flex rounded-2xl border border-purple/25 bg-purple/10 p-3 text-purple"><LockKeyhole className="h-6 w-6" aria-hidden="true" /></div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Portfolio admin</p>
          <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your space to manage stories and share what you’re building.</p>
          <LoginForm configured={isDatabaseConfigured()} />
        </section>
        <p className="mt-5 text-center text-xs text-muted-foreground">Private access · Elie’s portfolio</p>
      </div>
    </main>
  );
}
