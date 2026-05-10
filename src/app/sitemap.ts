import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { locales, localeUrl } from "@/lib/i18n";

export const dynamic = "force-static";

/**
 * Locale-aware sitemap. For every logical path we emit one entry per
 * locale, plus an `alternates.languages` map so search engines can pick
 * the right hreflang. The default locale (en) lives at the root path; the
 * other two locales sit under `/zh-Hans/...` and `/zh-Hant/...`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const cats = getAllCategories();
  const now = new Date();

  const fixedPaths = ["/", "/blog", "/archive", "/tags", "/categories"];
  const postPaths = posts.map((p) => `/blog/${p.slug}`);
  const tagPaths = tags.map(({ tag }) => `/tags/${encodeURIComponent(tag)}`);
  const catPaths = cats.map(
    ({ category }) => `/categories/${encodeURIComponent(category)}`,
  );

  const buildAlt = (path: string) =>
    Object.fromEntries(
      locales.map((l) => [l, localeUrl(l, path)]),
    );

  const entries: MetadataRoute.Sitemap = [];

  for (const path of fixedPaths) {
    const priority =
      path === "/" ? 1 : path === "/blog" ? 0.8 : 0.5;
    for (const l of locales) {
      entries.push({
        url: localeUrl(l, path),
        lastModified: now,
        priority,
        alternates: { languages: buildAlt(path) },
      });
    }
  }

  for (const p of posts) {
    const path = `/blog/${p.slug}`;
    for (const l of locales) {
      entries.push({
        url: localeUrl(l, path),
        lastModified: new Date(p.frontmatter.updated ?? p.frontmatter.date),
        priority: 0.7,
        alternates: { languages: buildAlt(path) },
      });
    }
  }

  for (const path of tagPaths) {
    for (const l of locales) {
      entries.push({
        url: localeUrl(l, path),
        lastModified: now,
        priority: 0.4,
        alternates: { languages: buildAlt(path) },
      });
    }
  }

  for (const path of catPaths) {
    for (const l of locales) {
      entries.push({
        url: localeUrl(l, path),
        lastModified: now,
        priority: 0.4,
        alternates: { languages: buildAlt(path) },
      });
    }
  }

  return entries;
}
