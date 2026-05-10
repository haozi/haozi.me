import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

export function TagsIndex({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const tags = getAllTags();
  return (
    <div className="mx-auto max-w-[860px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-10">
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          {d.tags.eyebrow}
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          {d.tags.title}
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {d.tags.summary(tags.length)}
        </p>
      </header>
      <ul className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={localeHref(lang, `/tags/${encodeURIComponent(tag)}`)}
              className="modern-chip"
              style={{ padding: "6px 14px", fontSize: 14 }}
            >
              <span>#{tag}</span>
              <span style={{ opacity: 0.6 }}>· {count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
