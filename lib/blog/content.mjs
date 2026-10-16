const blocks = new Set(['doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'blockquote', 'codeBlock', 'hardBreak', 'horizontalRule', 'image', 'text']);
const styles = new Set(['bold', 'italic', 'strike', 'underline', 'code', 'link']);
export const emptyContent = { type: 'doc', content: [{ type: 'paragraph' }] };
export const mediaId = (url) => typeof url === 'string' && /^\/api\/media\/([a-f0-9]{24})$/.exec(url)?.[1];
export function safeLink(value) {
  if (typeof value !== 'string' || value.length > 2000) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
export function validateContent(input) {
  let count = 0;
  let size = 0;
  function visit(node, depth) {
    if (!node || typeof node !== 'object' || !blocks.has(node.type) || depth > 20 || ++count > 3000) throw new Error('Article content is too large or contains unsupported formatting.');
    const result = { type: node.type };
    const inline = new Set(['text', 'hardBreak']);
    const block = new Set(['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'horizontalRule', 'image']);
    if (node.content && !Array.isArray(node.content)) throw new Error('Invalid article structure.');
    for (const child of node.content ?? []) {
      const allowed = node.type === 'doc' || node.type === 'blockquote' || node.type === 'listItem' ? block
        : node.type === 'paragraph' || node.type === 'heading' ? inline
        : node.type === 'bulletList' || node.type === 'orderedList' ? new Set(['listItem'])
        : node.type === 'codeBlock' ? new Set(['text']) : new Set();
      if (!allowed.has(child?.type)) throw new Error('Invalid article structure.');
    }
    if (node.type === 'doc' && depth !== 0) throw new Error('Invalid article structure.');
    if (node.type === 'text') {
      if (typeof node.text !== 'string') throw new Error('Invalid article text.');
      size += node.text.length;
      if (size > 100000) throw new Error('Article text is limited to 100,000 characters.');
      result.text = node.text;
      if (node.marks) {
        if (!Array.isArray(node.marks) || node.marks.length > 10) throw new Error('Invalid formatting.');
        result.marks = node.marks.map(mark => {
          if (!styles.has(mark?.type)) throw new Error('Unsupported formatting.');
          if (mark.type === 'link') {
            const href = safeLink(mark.attrs?.href);
            if (!href) throw new Error('Links must start with https://, http://, or mailto:.');
            return { type: 'link', attrs: { href } };
          }
          return { type: mark.type };
        });
      }
    }
    if (node.type === 'heading') result.attrs = { level: node.attrs?.level === 3 ? 3 : 2 };
    if (node.type === 'orderedList') result.attrs = { start: Math.min(10000, Math.max(1, Number(node.attrs?.start) || 1)) };
    if (node.type === 'image') {
      if (!mediaId(node.attrs?.src)) throw new Error('Use an uploaded image for article images.');
      result.attrs = { src: node.attrs.src, alt: String(node.attrs.alt ?? '').slice(0, 300) };
    }
    if (node.content) {
      if (!Array.isArray(node.content)) throw new Error('Invalid article structure.');
      result.content = node.content.map(child => visit(child, depth + 1));
    }
    return result;
  }
  if (input?.type !== 'doc') throw new Error('Invalid article document.');
  return visit(input, 0);
}
export function contentText(node) {
  return [node.text ?? '', ...(node.content ?? []).map(contentText)].join(' ').trim();
}
export function imageIds(content, cover = '') {
  const ids = new Set();
  function visit(node) {
    if (node.type === 'image' && mediaId(node.attrs?.src)) ids.add(mediaId(node.attrs.src));
    (node.content ?? []).forEach(visit);
  }
  visit(content);
  if (mediaId(cover)) ids.add(mediaId(cover));
  return [...ids];
}
export function slugify(value) {
  return String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/,'');
}
export function validateArticle(raw) {
  const title = String(raw.title ?? '').trim();
  const slug = String(raw.slug ?? '').trim();
  const description = String(raw.description ?? '').trim();
  if (!title || title.length > 160) throw new Error('Enter a title of 1–160 characters.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) throw new Error('Use a URL slug with lowercase letters, numbers, and hyphens (up to 100 characters).');
  if (description.length > 400) throw new Error('Keep the summary within 400 characters.');
  const tags = [...new Set(String(raw.tags ?? '').split(',').map(t => t.trim()).filter(Boolean))];
  if (tags.length > 8 || tags.some(t => t.length > 40)) throw new Error('Use up to eight tags, each under 40 characters.');
  const cover = String(raw.cover ?? '');
  if (cover && !mediaId(cover)) throw new Error('Use an uploaded cover image.');
  const content = validateContent(typeof raw.content === 'string' ? JSON.parse(raw.content) : raw.content);
  return { title, slug, description, tags, cover, coverAlt: String(raw.coverAlt ?? '').slice(0,300), content };
}
