import Link from "next/link";
import { getAllCategories } from "@/lib/posts";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

export function CategoriesIndex({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const cats = getAllCategories();
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
          {d.categories.eyebrow}
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          {d.categories.title}
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {d.categories.summary(cats.length)}
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cats.map(({ category, count }) => (
          <li key={category}>
            <Link
              href={localeHref(
                lang,
                `/categories/${encodeURIComponent(category)}`,
              )}
              className="modern-card group flex items-center justify-between p-5 no-underline"
            >
              <span
                className="text-[16px] font-semibold transition-colors group-hover:text-[color:var(--color-accent-green)]"
                style={{
                  color: "var(--color-brand-green)",
                  letterSpacing: "-0.012em",
                }}
              >
                {category}
              </span>
              <span
                className="text-[13px]"
                style={{
                  color: "var(--color-text-soft)",
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {d.categories.posts_in_category(count)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
