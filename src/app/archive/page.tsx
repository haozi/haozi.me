import type { Metadata } from "next";
import Link from "next/link";
import { getArchive } from "@/lib/posts";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "归档",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  const groups = getArchive();
  const total = groups.reduce((acc, g) => acc + g.posts.length, 0);
  return (
    <div className="mx-auto max-w-[860px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-12">
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          Archive
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          归档
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          共 {total} 篇 · 按年份排列
        </p>
      </header>

      <div className="space-y-12">
        {groups.map(({ year, posts }) => (
          <section key={year}>
            <div className="mb-4 flex items-baseline gap-3">
              <h2
                className="text-[28px] font-semibold"
                style={{
                  color: "var(--color-brand-green)",
                  letterSpacing: "-0.012em",
                }}
              >
                {year}
              </h2>
              <span
                className="text-[13px]"
                style={{
                  color: "var(--color-text-soft)",
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {posts.length} 篇
              </span>
            </div>
            <ul
              className="border-l"
              style={{ borderColor: "var(--color-hairline)" }}
            >
              {posts.map((p) => (
                <li
                  key={p.slug}
                  className="-ml-px"
                >
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col gap-1 border-l-2 px-4 py-3 no-underline transition-colors sm:flex-row sm:items-baseline sm:gap-4"
                    style={{
                      borderColor: "transparent",
                      letterSpacing: "var(--tracking-tight)",
                    }}
                  >
                    <time
                      dateTime={p.frontmatter.date}
                      className="w-24 shrink-0 font-mono text-[12px]"
                      style={{ color: "var(--color-text-soft)" }}
                    >
                      {formatDateShort(p.frontmatter.date)}
                    </time>
                    <span
                      className="text-[16px] font-medium transition-colors group-hover:text-[color:var(--color-accent-green)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      {p.frontmatter.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
