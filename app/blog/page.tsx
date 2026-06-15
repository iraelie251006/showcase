import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Notes on projects, debugging, and the tools I use.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 md:py-32">
      <header className="mb-12">
        <h1 className="text-4xl font-bold md:text-5xl">Blog</h1>
        <p className="text-muted-foreground mt-3 text-base md:text-lg">
          Notes on projects, debugging, and the tools I use.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-white/10 pb-8 last:border-b-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-2xl font-semibold group-hover:text-purple transition-colors">
                  {post.title}
                </h2>
                <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
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
                {post.description && (
                  <p className="text-muted-foreground mt-3 text-sm md:text-base">
                    {post.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
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
