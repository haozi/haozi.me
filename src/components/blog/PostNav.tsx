import Link from "next/link";
import type { Post } from "@/lib/posts";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

/**
 * Modern prev/next navigation — two white cards, 12px radius,
 * whisper-soft shadow, sitting at the foot of an article. Locale-aware.
 */
export function PostNav({
  prev,
  next,
  lang,
}: {
  prev: Post | null;
  next: Post | null;
  lang: Locale;
}) {
  const d = getDictionary(lang);
  if (!prev && !next) return null;
  return (
    <nav
      aria-label={d.post.nav_label}
      className="mt-16 grid grid-cols-1 gap-4 border-t pt-10 sm:grid-cols-2"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      {prev ? (
        <NavCard direction="prev" post={prev} lang={lang} label={d.post.prev} />
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <NavCard direction="next" post={next} lang={lang} label={d.post.next} />
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function NavCard({
  direction,
  post,
  lang,
  label,
}: {
  direction: "prev" | "next";
  post: Post;
  lang: Locale;
  label: string;
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={localeHref(lang, `/blog/${post.slug}`)}
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
        {label}
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
