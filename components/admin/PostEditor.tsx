'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { savePost } from '@/app/admin/post-actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { articleClassName } from '@/components/blog/ArticleContent';
import { safeLink, slugify } from '@/lib/blog/content.mjs';
import type { serializePost } from '@/lib/blog/store';

const button = 'inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';
export default function PostEditor({ post }: { post: ReturnType<typeof serializePost> }) {
  const [title, setTitle] = useState(post.draft.title);
  const [slug, setSlug] = useState(post.draft.slug);
  const [description, setDescription] = useState(post.draft.description);
  const [tags, setTags] = useState(post.draft.tags.join(', '));
  const [cover, setCover] = useState(post.draft.cover);
  const [coverAlt, setCoverAlt] = useState(post.draft.coverAlt);
  const [revision, setRevision] = useState(post.revision);
  const [published, setPublished] = useState(post.published);
  const [everPublished, setEverPublished] = useState(Boolean(post.publishedAt));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(true);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<'cover' | 'body'>('body');
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), Image.configure({ allowBase64: false })],
    content: post.draft.content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: `${articleClassName} min-h-[420px] p-6 sm:p-10 focus:outline-none`, role: 'textbox', 'aria-label': 'Article body', 'aria-multiline': 'true' } },
    onUpdate: () => { setDirty(true); setNotice(''); setPreview(false); },
  });
  useEffect(() => { editor?.setEditable(!busy && !uploading, false); }, [editor, busy, uploading]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty || uploading) event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, uploading]);
  const changed = () => { setDirty(true); setNotice(''); setPreview(false); };
  async function save(intent: 'save' | 'publish' | 'unpublish') {
    if (!editor || busy || uploading) return;
    setBusy(true); setError(''); setNotice(''); setPreview(false);
    try {
      const result = await savePost(post.id, revision, { title, slug, description, tags, cover, coverAlt, content: editor.getJSON() }, intent);
      if ('error' in result) { setError(result.error ?? 'Could not save.'); return; }
      setRevision(result.revision); setPublished(result.published); if (intent === 'publish') setEverPublished(true); setDirty(false); setPreview(true);
      setNotice(intent === 'publish' ? 'Published. Your article is live on the blog.' : intent === 'unpublish' ? 'Unpublished. This article is now private.' : 'Draft saved.');
    } catch { setError('Could not save. Keep this page open and try again. If your session expired, sign in again in another tab.'); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file || !editor) return;
    setError(''); setUploading(true);
    try {
      if (file.size > 3 * 1024 * 1024) throw new Error('Choose an image under 3 MB.');
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPEG, PNG, or WebP image.');
      const res = await fetch(`/api/admin/uploads?postId=${post.id}`, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed.');
      if (uploadTarget.current === 'cover') setCover(data.url);
      else editor.chain().focus().setImage({ src: data.url, alt: imageAlt }).run();
      changed();
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed.'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  }
  function tool(label: string, action: () => void, active = false): ReactNode {
    return <button type="button" title={label} aria-pressed={active} disabled={busy || uploading || !editor} onClick={action} className={`${button} !px-3 !py-2 ${active ? '!border-purple !bg-purple/10 text-purple' : ''}`}>{label}</button>;
  }
  return <main className="relative z-10 mx-auto max-w-6xl px-5 py-24">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <Link href="/admin" onClick={e => { if (dirty && !window.confirm('Leave without saving your changes?')) e.preventDefault(); }} className="text-sm text-muted-foreground">← All articles</Link>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">{uploading ? 'Uploading image…' : busy ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}</span>
        <button className={button} disabled={busy || uploading || !editor} onClick={() => save('save')}>Save draft</button>
        <button className={`${button} !border-purple !bg-purple text-white dark:text-black-100`} disabled={busy || uploading || !editor} onClick={() => save('publish')}>{published ? 'Publish changes' : 'Publish article'}</button>
      </div>
    </header>
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <span className="rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-xs text-purple">{published ? 'Published' : 'Draft'}</span>
      {published && <><a className="text-sm text-purple underline" target="_blank" rel="noopener noreferrer" href={`/blog/${slug}`}>View live article ↗</a><button disabled={busy || uploading} className="text-sm text-muted-foreground underline" onClick={() => { if (window.confirm('Remove this article from the public blog? Your draft will be kept.')) save('unpublish'); }}>Unpublish</button></>}
      {preview && !dirty && <a target="_blank" rel="noopener noreferrer" className="text-sm text-purple underline" href={`/admin/posts/${post.id}/preview`}>Preview saved draft ↗</a>}
    </div>
    <div aria-live="polite" aria-atomic="true" className="mb-6">{error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">{error}</p>}{notice && <p className="rounded-lg border border-purple/30 bg-purple/10 p-4 text-sm">{notice}</p>}</div>
    <fieldset disabled={busy || uploading} className="grid min-w-0 gap-8 lg:grid-cols-[1fr_280px]">
      <section className="min-w-0 space-y-5">
        <div className="space-y-2"><Label htmlFor="post-title">Article title</Label><Input id="post-title" className="h-14 text-xl md:text-xl" value={title} maxLength={160} onChange={e => { setTitle(e.target.value); changed(); }} /></div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div role="toolbar" aria-label="Article formatting" className="flex flex-wrap gap-1.5 border-b border-border bg-muted/30 p-3">
            {tool('Bold', () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold'))}
            {tool('Italic', () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic'))}
            {tool('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive('heading', {level:2}))}
            {tool('H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editor?.isActive('heading', {level:3}))}
            {tool('Bullets', () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList'))}
            {tool('Numbered list', () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList'))}
            {tool('Quote', () => editor?.chain().focus().toggleBlockquote().run(), editor?.isActive('blockquote'))}
            {tool('Code block', () => editor?.chain().focus().toggleCodeBlock().run(), editor?.isActive('codeBlock'))}
            {tool('Link', () => setLinkOpen(!linkOpen), editor?.isActive('link'))}
            {tool('Undo', () => editor?.chain().focus().undo().run())}
            {tool('Redo', () => editor?.chain().focus().redo().run())}
          </div>
          {linkOpen && <div className="flex flex-wrap gap-2 border-b border-border p-3"><Input aria-label="Link URL" placeholder="https://example.com" value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} /><button className={button} onClick={()=>{ const href = safeLink(linkUrl); if (!href) {setError('Enter a complete https://, http://, or mailto: link.');return;} editor?.chain().focus().extendMarkRange('link').setLink({href}).run(); setLinkOpen(false); setLinkUrl(''); changed(); }}>Apply link</button><button className={button} onClick={()=>{editor?.chain().focus().unsetLink().run();setLinkOpen(false);changed();}}>Remove link</button></div>}
          <EditorContent editor={editor} />
        </div>
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"><div className="flex-1 space-y-2"><Label htmlFor="image-alt">Describe the next image</Label><Input id="image-alt" placeholder="Architecture diagram showing two app servers…" maxLength={300} value={imageAlt} onChange={e=>setImageAlt(e.target.value)} /></div><button className={button} onClick={()=>{uploadTarget.current='body';fileInput.current?.click();}}>Insert image</button><p className="w-full text-xs text-muted-foreground">JPEG, PNG, WebP · Up to 3 MB · Images are optimized automatically.</p></div>
      </section>
      <aside className="space-y-6 rounded-2xl border border-border bg-card p-5 self-start">
        <h2 className="font-semibold">Article details</h2>
        <div className="space-y-2"><Label htmlFor="post-slug">URL slug</Label><Input id="post-slug" value={slug} disabled={everPublished} onChange={e=>{setSlug(e.target.value);changed();}} /><p className="break-all text-xs text-muted-foreground">/blog/{slug}</p>{!everPublished && <button className="text-xs text-purple underline" onClick={()=>{setSlug(slugify(title));changed();}}>Generate from title</button>}</div>
        <div className="space-y-2"><Label htmlFor="post-summary">Summary</Label><textarea id="post-summary" rows={5} maxLength={400} className="w-full rounded-lg border border-input bg-background/50 p-3 text-sm" value={description} onChange={e=>{setDescription(e.target.value);changed();}} /><p className="text-xs text-muted-foreground">{description.length}/400 characters</p></div>
        <div className="space-y-2"><Label htmlFor="post-tags">Tags</Label><Input id="post-tags" placeholder="AWS, DevOps, Node.js" value={tags} onChange={e=>{setTags(e.target.value);changed();}} /><p className="text-xs text-muted-foreground">Separate up to eight tags with commas.</p></div>
        <div className="space-y-3"><h3 className="text-sm font-medium">Cover image</h3>{cover && <img src={cover} alt={coverAlt} className="aspect-video w-full rounded-lg object-cover" />}<button className={button} onClick={()=>{uploadTarget.current='cover';fileInput.current?.click();}}>{cover ? 'Replace cover' : 'Upload cover'}</button>{cover && <><Label htmlFor="cover-alt">Cover description</Label><Input id="cover-alt" value={coverAlt} maxLength={300} onChange={e=>{setCoverAlt(e.target.value);changed();}} /><button className="block text-xs text-muted-foreground underline" onClick={()=>{setCover('');changed();}}>Remove cover</button></>}</div>
        <p className="text-xs leading-relaxed text-muted-foreground">Saving a draft keeps the current live article unchanged. Use Publish changes when your update is ready.</p>
      </aside>
    </fieldset>
    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="Upload article image" onChange={e=>upload(e.target.files?.[0])} />
  </main>;
}
