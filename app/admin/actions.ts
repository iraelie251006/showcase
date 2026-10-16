'use server';

import { redirect } from 'next/navigation';
import { getDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { allowLoginAttempt, createAdminSession, deleteAdminSession, type Admin } from '@/lib/auth/admin';
import { verifyPassword } from '@/lib/auth/password.mjs';

export async function login(_state: { error: string }, form: FormData) {
  if (!isDatabaseConfigured()) return { error: 'Admin sign-in is not configured yet.' };
  try {
    if (!(await allowLoginAttempt())) return { error: 'Too many attempts. Please try again in 15 minutes.' };
    const email = form.get('email');
    const password = form.get('password');
    if (typeof email !== 'string' || email.length > 254 || typeof password !== 'string' || password.length > 256) {
      return { error: 'Email or password is incorrect.' };
    }
    const db = await getDatabase();
    const owner = await db.collection<Admin>('admin_users').findOne({ _id: 'owner' });
    // Perform the expensive check regardless of the email to avoid revealing it.
    const valid = owner && await verifyPassword(password, owner.passwordHash);
    if (!valid || owner.email !== email.trim().toLowerCase()) return { error: 'Email or password is incorrect.' };
    await createAdminSession(owner);
  } catch {
    return { error: 'Sign-in is temporarily unavailable. Please try again shortly.' };
  }
  redirect('/admin');
}

export async function logout() {
  await deleteAdminSession();
  redirect('/admin/login');
}
