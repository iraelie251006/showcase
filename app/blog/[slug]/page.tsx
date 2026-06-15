import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 md:py-32">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-block text-sm transition-colors"
      >
        ← Back to blog
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{post.tags.join(", ")}</span>
            </>
          )}
        </div>
      </header>

      <article className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-purple prose-a:no-underline hover:prose-a:underline prose-code:text-purple prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10">
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
