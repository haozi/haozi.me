import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "分类",
  alternates: { canonical: "/categories" },
};

export default function CategoriesIndex() {
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
          Categories
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          分类
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {cats.length} 个分类
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cats.map(({ category, count }) => (
          <li key={category}>
            <Link
              href={`/categories/${encodeURIComponent(category)}`}
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
                {count} 篇
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
