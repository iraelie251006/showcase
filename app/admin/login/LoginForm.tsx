'use client';

import { useActionState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { login } from '../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, { error: '' });
  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email address</Label>
        <Input className="h-12 bg-background/60" id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} disabled={pending || !configured} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input className="h-12 bg-background/60" id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} disabled={pending || !configured} />
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        {!configured && <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">Admin sign-in is not configured yet. Please check back later.</p>}
      </div>
      <button disabled={pending || !configured} className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-purple px-5 font-medium text-white dark:text-black-100 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
      </button>
    </form>
  );
}
