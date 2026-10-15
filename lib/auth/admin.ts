import 'server-only';
import { randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { digest } from './password.mjs';

const COOKIE = process.env.NODE_ENV === 'production' ? '__Host-portfolio-admin' : 'portfolio-admin';
const SESSION_SECONDS = 8 * 60 * 60;
export type Admin = { _id: string; email: string; passwordHash: string };
type Session = { _id: string; expiresAt: Date; credentialVersion: string };
type Attempt = { _id: string; count: number; expiresAt: Date };

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token) || !isDatabaseConfigured()) return null;
  const db = await getDatabase();
  const session = await db.collection<Session>('admin_sessions').findOne({
    _id: digest(token), expiresAt: { $gt: new Date() },
  });
  if (!session) return null;
  const owner = await db.collection<Admin>('admin_users').findOne({ _id: 'owner' });
  if (!owner || session.credentialVersion !== digest(owner.passwordHash)) return null;
  return { email: owner.email };
}

// Call inside every future admin mutation or API handler as well as protected pages.
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function createAdminSession(owner: Admin) {
  const db = await getDatabase();
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  await db.collection<Session>('admin_sessions').insertOne({
    _id: digest(token), expiresAt, credentialVersion: digest(owner.passwordHash),
  });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS, expires: expiresAt,
  });
}

export async function deleteAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token && isDatabaseConfigured()) {
    const db = await getDatabase();
    await db.collection<Session>('admin_sessions').deleteOne({ _id: digest(token) });
  }
  jar.delete(COOKIE);
}

export async function allowLoginAttempt() {
  const db = await getDatabase();
  const requestHeaders = await headers();
  const ip = requestHeaders.get('x-vercel-forwarded-for') ?? requestHeaders.get('x-forwarded-for') ?? 'local';
  const windowMs = 15 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const expiresAt = new Date((bucket + 2) * windowMs);
  // Atomic shared counters work across Vercel instances. The global cap also
  // bounds password hashing work if a client supplies different IP headers.
  const attempts = db.collection<Attempt>('admin_login_attempts');
  const global = await attempts.findOneAndUpdate(
    { _id: `global:${bucket}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, returnDocument: 'after' },
  );
  if (!global || global.count > 100) return false;
  const local = await attempts.findOneAndUpdate(
    { _id: `${digest(ip)}:${bucket}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, returnDocument: 'after' },
  );
  return Boolean(local && local.count <= 10);
}
