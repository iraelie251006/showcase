/* eslint-disable @next/next/no-img-element */
import { createElement, Fragment, type ReactNode } from 'react';
import type { JSONContent } from '@tiptap/react';
import { safeLink, mediaId } from '@/lib/blog/content.mjs';

export const articleClassName = 'prose dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-purple prose-pre:bg-muted dark:prose-pre:bg-black/40 prose-pre:border prose-pre:border-border prose-img:rounded-xl';
function render(node: JSONContent, key: number): ReactNode {
  const children = node.content?.map((child, i) => render(child, i));
  if (node.type === 'text') {
    let value: ReactNode = node.text;
    node.marks?.forEach(mark => {
      const tags: Record<string, string> = { bold: 'strong', italic: 'em', strike: 's', underline: 'u', code: 'code' };
      if (tags[mark.type]) value = createElement(tags[mark.type], null, value);
      else if (mark.type === 'link' && safeLink(mark.attrs?.href)) value = <a href={safeLink(mark.attrs?.href)!} rel="noopener noreferrer">{value}</a>;
    });
    return <Fragment key={key}>{value}</Fragment>;
  }
  if (node.type === 'image') return mediaId(node.attrs?.src) ? <img key={key} src={node.attrs!.src} alt={node.attrs?.alt ?? ''} loading="lazy" /> : null;
  if (node.type === 'hardBreak') return <br key={key} />;
  if (node.type === 'horizontalRule') return <hr key={key} />;
  if (node.type === 'codeBlock') return <pre key={key}><code>{children}</code></pre>;
  const tags: Record<string, string> = { paragraph: 'p', bulletList: 'ul', orderedList: 'ol', listItem: 'li', blockquote: 'blockquote' };
  if (node.type === 'heading') return createElement(node.attrs?.level === 3 ? 'h3' : 'h2', { key }, children);
  if (node.type && tags[node.type]) return createElement(tags[node.type], { key, ...(node.type === 'orderedList' ? { start: node.attrs?.start } : {}) }, children);
  return <Fragment key={key}>{children}</Fragment>;
}
export default function ArticleContent({ content }: { content: JSONContent }) {
  return <article className={articleClassName}>{render(content, 0)}</article>;
}
