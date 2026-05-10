"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type Locale, localeHref } from "@/lib/i18n";

type IndexEntry = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  date: string;
  body: string; // lowercased plaintext extract
};

type SearchStrings = {
  placeholder: string;
  loading: string;
  no_results: string;
};

/**
 * Static-index search. The index is generated at build time (see
 * `scripts/build-search-index.mjs`) and lives at /search-index.json.
 *
 * We fetch it lazily on first focus so the homepage doesn't pay the cost.
 * Locale-aware: result links are prefixed with the active locale, strings
 * are passed in from the server parent.
 */
export function Search({
  lang,
  strings,
}: {
  lang: Locale;
  strings: SearchStrings;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<IndexEntry[] | null>(null);

  useEffect(() => {
    if (!open || index) return;
    let alive = true;
    fetch("/search-index.json")
      .then((r) => r.json() as Promise<IndexEntry[]>)
      .then((data) => alive && setIndex(data))
      .catch(() => alive && setIndex([]));
    return () => {
      alive = false;
    };
  }, [open, index]);

  const results = useMemo(() => {
    if (!q.trim() || !index) return [];
    const needle = q.trim().toLowerCase();
    return index
      .map((e) => {
        const hay = `${e.title} ${e.description} ${e.tags.join(" ")} ${e.body}`.toLowerCase();
        const score =
          (e.title.toLowerCase().includes(needle) ? 5 : 0) +
          (e.description.toLowerCase().includes(needle) ? 2 : 0) +
          (hay.includes(needle) ? 1 : 0);
        return { e, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.e);
  }, [q, index]);

  return (
    <div className="relative">
      <input
        type="search"
        placeholder={strings.placeholder}
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-md border border-[var(--rule)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--fg)]"
      />
      {open && q.trim() ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-auto rounded-md border border-[var(--rule)] bg-[var(--bg)] shadow-lg">
          {!index ? (
            <div className="p-3 text-sm text-[var(--muted)]">
              {strings.loading}
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-[var(--muted)]">
              {strings.no_results}
            </div>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={localeHref(lang, `/blog/${r.slug}`)}
                    className="block px-3 py-2 text-sm no-underline hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]"
                  >
                    <div className="font-medium">{r.title}</div>
                    {r.description ? (
                      <div className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">
                        {r.description}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
