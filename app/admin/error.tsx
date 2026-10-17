'use client';

import Link from 'next/link';

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 px-5 py-24">
      <h1 className="font-display text-2xl">Workspace unavailable</h1>
      <p className="text-muted-foreground">We couldn’t connect to your workspace. Please try again shortly.</p>
      <button onClick={reset} className="rounded-lg border border-border bg-card px-5 py-3">Try again</button>
      <Link href="/" className="text-sm text-purple">← Back to portfolio</Link>
    </main>
  );
}
