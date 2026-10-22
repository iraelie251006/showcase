import test from 'node:test';
import assert from 'node:assert/strict';
import { articles } from '../content/imports/linkedin-articles/articles.mjs';
import { validateArticle, contentText } from '../lib/blog/content.mjs';

test('six unique draft articles validate using the blog editor schema', () => {
  assert.equal(articles.length, 6);
  assert.equal(new Set(articles.map(a=>a.slug)).size, 6);
  for (const article of articles) {
    const content = JSON.parse(JSON.stringify(article.content).replaceAll(`asset:${article.image}`,'/api/media/0123456789abcdef01234567'));
    assert.doesNotThrow(()=>validateArticle({...article,tags:article.tags.join(', '),content}));
    assert.ok(contentText(content).split(/\s+/).length > 350);
  }
});
test('confirmed architecture choices and retired status are included', () => {
  const net = contentText(articles.find(a=>a.slug.startsWith('netsentry')).content);
  const dev = contentText(articles.find(a=>a.slug.startsWith('devflow')).content);
  assert.match(net,/Redis as the centralized session and application data store/);
  assert.match(net,/deployment is retired/);
  assert.match(dev,/use_lockfile = true/);
  assert.match(dev,/no DynamoDB locking table/);
});
