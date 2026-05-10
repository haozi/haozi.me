import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/dict";
import { type Locale, intlLocale, localeHref } from "@/lib/i18n";

/**
 * Modern post metadata — clean horizontal row that sits above (or below)
 * an article title. Date / reading time / category / tag chips, all with
 * tight -0.01em tracking and 87%-black text. Locale-aware links + dates.
 */
export function PostMeta({
  post,
  lang,
  className,
}: {
  post: Post;
  lang: Locale;
  className?: string;
}) {
  const d = getDictionary(lang);
  const { frontmatter, readingTimeMinutes } = post;
  const tags = frontmatter.tags ?? [];

  return (
    <div
      className={
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] " +
        (className ?? "")
      }
      style={{
        color: "var(--color-text-soft)",
        letterSpacing: "var(--tracking-tight)",
      }}
    >
      <time dateTime={String(frontmatter.date)}>
        {formatDate(frontmatter.date, intlLocale[lang])}
      </time>

      {readingTimeMinutes ? (
        <>
          <span aria-hidden="true" className="opacity-50">·</span>
          <span>
            {readingTimeMinutes} {d.blog.min_read}
          </span>
        </>
      ) : null}

      {frontmatter.category ? (
        <>
          <span aria-hidden="true" className="opacity-50">·</span>
          <Link
            href={localeHref(
              lang,
              `/categories/${encodeURIComponent(frontmatter.category)}`,
            )}
            className="font-semibold uppercase hover:opacity-80"
            style={{
              color: "var(--color-accent-green)",
              letterSpacing: "0.08em",
            }}
          >
            {frontmatter.category}
          </Link>
        </>
      ) : null}

      {tags.length > 0 ? (
        <span className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={localeHref(lang, `/tags/${encodeURIComponent(tag)}`)}
              className="modern-chip"
              style={{ padding: "2px 10px", fontSize: 12 }}
            >
              {tag}
            </Link>
          ))}
        </span>
      ) : null}
    </div>
  );
}
