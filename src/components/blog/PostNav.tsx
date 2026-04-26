import Link from "next/link";
import type { Post } from "@/lib/posts";

/**
 * Modern prev/next navigation — two white cards, 12px radius,
 * whisper-soft shadow, sitting at the foot of an article.
 */
export function PostNav({
  prev,
  next,
}: {
  prev: Post | null;
  next: Post | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="文章导航"
      className="mt-16 grid grid-cols-1 gap-4 border-t pt-10 sm:grid-cols-2"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      {prev ? (
        <NavCard direction="prev" post={prev} />
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <NavCard direction="next" post={next} />
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function NavCard({
  direction,
  post,
}: {
  direction: "prev" | "next";
  post: Post;
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="modern-card group block p-5 no-underline"
      style={{ textAlign: isNext ? "right" : "left" }}
    >
      <p
        className="text-[12px] font-semibold uppercase"
        style={{
          color: "var(--color-accent-green)",
          letterSpacing: "0.12em",
        }}
      >
        {isNext ? "下一篇（更新）→" : "← 上一篇（更旧）"}
      </p>
      <p
        className="mt-2 text-[16px] font-semibold leading-snug transition-colors group-hover:text-[color:var(--color-accent-green)]"
        style={{
          color: "var(--color-brand-green)",
          letterSpacing: "-0.012em",
        }}
      >
        {post.frontmatter.title}
      </p>
    </Link>
  );
}
