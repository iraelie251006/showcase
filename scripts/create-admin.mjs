import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { MongoClient } from 'mongodb';
import { hashPassword } from '../lib/auth/password.mjs';

if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
  console.error('Set MONGODB_URI and MONGODB_DB in .env.local first. See docs/admin-setup.md.');
  process.exit(1);
}
if (!process.stdin.isTTY) {
  console.error('Run this command in an interactive terminal. Password input is hidden.');
  process.exit(1);
}
let hidden = false;
const output = new Writable({ write(chunk, encoding, callback) {
  if (!hidden) process.stdout.write(chunk, encoding);
  callback();
} });
const prompt = createInterface({ input: process.stdin, output, terminal: true });
async function secret(label) {
  process.stdout.write(label);
  hidden = true;
  try { return await prompt.question(''); }
  finally { hidden = false; process.stdout.write('\n'); }
}
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
try {
  const email = (await prompt.question('Admin email: ')).trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const password = await secret('Password (12–256 characters, hidden): ');
  const confirmation = await secret('Confirm password (hidden): ');
  if (password !== confirmation) throw new Error('Passwords do not match.');
  const passwordHash = await hashPassword(password);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const users = db.collection('admin_users');
  const existing = await users.findOne({ _id: 'owner' });
  if (existing) {
    const confirm = await prompt.question('An owner already exists. Replace credentials and revoke all sessions? Type REPLACE: ');
    if (confirm !== 'REPLACE') throw new Error('Account left unchanged.');
  }
  await db.collection('admin_sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('admin_login_attempts').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await users.updateOne({ _id: 'owner' }, { $set: { email, passwordHash, updatedAt: new Date() } }, { upsert: true });
  await db.collection('admin_sessions').deleteMany({});
  console.log('Admin account ready. Sign in at /admin/login.');
} catch (error) {
  // Never print driver errors: connection strings can include credentials.
  if (error?.name === 'MongoServerSelectionError' || error?.name?.startsWith('Mongo')) {
    console.error('Could not configure Atlas. Check the connection, database permissions, and network access.');
  } else console.error(error instanceof Error ? error.message : 'Account setup failed.');
  process.exitCode = 1;
} finally {
  prompt.close();
  await client.close();
}
