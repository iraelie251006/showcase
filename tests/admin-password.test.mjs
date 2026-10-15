import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, digest } from '../lib/auth/password.mjs';

test('password hashing uses unique salts and accepts only the matching password', async () => {
  const password = 'a long test-only password';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('a different password', first), false);
  assert.equal(first.includes(password), false);
});
test('invalid hashes and oversized input fail closed', async () => {
  for (const hash of ['', 'scrypt:bad:hash', null, 'scrypt:' + 'f'.repeat(32) + ':ff']) {
    assert.equal(await verifyPassword('anything', hash), false);
  }
  await assert.rejects(hashPassword('short'));
  await assert.rejects(hashPassword('x'.repeat(257)));
  assert.equal(await verifyPassword('x'.repeat(257), await hashPassword('valid test password')), false);
});
test('session digests are deterministic and do not expose the token', () => {
  const token = 'sample-opaque-session-token';
  assert.match(digest(token), /^[a-f0-9]{64}$/);
  assert.equal(digest(token), digest(token));
  assert.notEqual(digest(token), digest(token + 'x'));
});
