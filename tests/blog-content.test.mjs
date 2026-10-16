import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, validateContent, safeLink, imageIds, slugify } from '../lib/blog/content.mjs';
const id = '0123456789abcdef01234567';
const text = { type: 'doc', content: [{ type:'paragraph', content:[{type:'text',text:'Hello'}] }] };
const article = {title:'A real article',slug:'a-real-article',description:'Summary',tags:'AWS, AWS, Redis',content:text,cover:''};
test('validates publishing metadata and normalizes tags', () => {
  assert.deepEqual(validateArticle(article).tags, ['AWS','Redis']);
  assert.equal(slugify('Building NetSentry: Shared Sessions!'), 'building-netsentry-shared-sessions');
  assert.throws(()=>validateArticle({...article,slug:'../../etc/passwd'}));
  assert.throws(()=>validateArticle({...article,title:''}));
  assert.throws(()=>validateArticle({...article,description:'x'.repeat(401)}));
});
test('rejects executable links, external images and unknown nodes', () => {
  for (const link of ['javascript:alert(1)','data:text/html,hi','//evil.example','file:///etc/passwd']) assert.equal(safeLink(link),null);
  assert.equal(safeLink('https://example.com'), 'https://example.com/');
  assert.throws(()=>validateContent({type:'doc',content:[{type:'script',text:'alert(1)'}]}));
  assert.throws(()=>validateContent({type:'doc',content:[{type:'image',attrs:{src:'https://evil.example/pixel'}}]}));
  assert.throws(()=>validateContent({type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'link',marks:[{type:'link',attrs:{href:'javascript:alert(1)'}}]}]}]}));
});
test('strips untrusted attributes and collects only uploaded image references', () => {
  const doc = validateContent({type:'doc',attrs:{onclick:'bad'},content:[{type:'image',attrs:{src:`/api/media/${id}`,alt:'Diagram',onerror:'bad'}}]});
  assert.equal(doc.attrs, undefined);
  assert.deepEqual(doc.content[0].attrs,{src:`/api/media/${id}`,alt:'Diagram'});
  assert.deepEqual(imageIds(doc,`/api/media/${id}`),[id]);
});
test('rejects excessive nesting, malformed structure and oversized documents', () => {
  let deep = {type:'paragraph'};
  for (let i=0;i<25;i++) deep = {type:'blockquote',content:[deep]};
  assert.throws(()=>validateContent({type:'doc',content:[deep]}));
  assert.throws(()=>validateContent({type:'doc',content:{type:'paragraph'}}));
  assert.throws(()=>validateContent({type:'doc',content:[{type:'text',text:'Invalid root text'}]}));
  assert.throws(()=>validateContent({type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'x'.repeat(100001)}]}]}));
});
