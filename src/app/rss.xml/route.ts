import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteCore } from "@/lib/site";
import { getDictionary } from "@/lib/dict";
import { defaultLocale, intlLocale } from "@/lib/i18n";

/**
 * RSS feed for the default locale (English, at the URL root `/rss.xml`).
 * Per-locale feeds live under `/zh-Hans/rss.xml` / `/zh-Hant/rss.xml`.
 *
 * With `output: "export"` Next renders this once at build time into
 * `out/rss.xml/index.xml`. The route name `/rss.xml/route.ts` plus
 * `dynamic = "force-static"` is what makes the URL `/rss.xml` resolve
 * to a real file in the export.
 */
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const d = getDictionary(defaultLocale);
  const feed = new Feed({
    title: d.site.title,
    description: d.site.description,
    id: siteCore.url,
    link: siteCore.url,
    language: intlLocale[defaultLocale],
    favicon: `${siteCore.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${siteCore.author.name}`,
    feedLinks: { rss2: `${siteCore.url}/rss.xml` },
    author: {
      name: siteCore.author.name,
      link: siteCore.author.url,
    },
  });

  for (const p of posts) {
    feed.addItem({
      id: `${siteCore.url}/blog/${p.slug}`,
      link: `${siteCore.url}/blog/${p.slug}`,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      date: new Date(p.frontmatter.date),
      category: (p.frontmatter.tags ?? []).map((t) => ({ name: t })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
