'use client';
import Link from 'next/link';
export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="relative z-10 mx-auto max-w-3xl px-5 py-32"><h1 className="text-3xl font-semibold">Articles are temporarily unavailable</h1><p className="mt-4 text-muted-foreground">Please try again shortly.</p><button onClick={reset} className="mt-6 rounded-lg border border-border bg-card px-5 py-3">Try again</button><Link href="/" className="ml-5 text-sm text-purple">Back to portfolio</Link></main>;
}
