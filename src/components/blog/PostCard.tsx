import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/dict";
import { type Locale, intlLocale, localeHref } from "@/lib/i18n";

/**
 * Modern PostCard — white card on cream canvas, locale-aware links.
 */
export function PostCard({ post, lang }: { post: Post; lang: Locale }) {
  const d = getDictionary(lang);
  const { slug, frontmatter, readingTimeMinutes } = post;
  const tags = frontmatter.tags?.slice(0, 3) ?? [];
  const category = frontmatter.category;

  return (
    <article className="modern-card group p-6">
      <Link href={localeHref(lang, `/blog/${slug}`)} className="block">
        {category ? (
          <p
            className="mb-2 text-[12px] font-semibold uppercase"
            style={{
              color: "var(--color-accent-green)",
              letterSpacing: "0.1em",
            }}
          >
            {category}
          </p>
        ) : null}

        <h2
          className="text-[22px] font-semibold leading-snug transition-colors group-hover:text-[color:var(--color-accent-green)]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.012em",
          }}
        >
          {frontmatter.title}
        </h2>

        {frontmatter.description ? (
          <p
            className="mt-3 text-[15px] leading-[1.65]"
            style={{ color: "var(--color-text)" }}
          >
            {frontmatter.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <p
            className="text-[13px]"
            style={{
              color: "var(--color-text-soft)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {formatDate(frontmatter.date, intlLocale[lang])}
            <span className="mx-2 opacity-50">·</span>
            {readingTimeMinutes} {d.blog.min_read}
          </p>
          <span
            className="text-[14px] font-semibold opacity-0 transition-opacity group-hover:opacity-100"
            style={{ color: "var(--color-accent-green)" }}
            aria-hidden="true"
          >
            {d.blog.read_arrow}
          </span>
        </div>
      </Link>

      {tags.length > 0 ? (
        <div
          className="mt-4 flex flex-wrap gap-2 pt-4"
          style={{ borderTop: "1px solid var(--color-hairline)" }}
        >
          {tags.map((tag) => (
            <Link
              key={tag}
              href={localeHref(lang, `/tags/${encodeURIComponent(tag)}`)}
              className="modern-chip"
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
