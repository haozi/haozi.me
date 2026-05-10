import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteCore } from "@/lib/site";
import { getDictionary } from "@/lib/dict";
import { localeHref, ogLocale } from "@/lib/i18n";

const lang = "zh-Hant" as const;

export const dynamic = "force-static";

export async function GET() {
  const d = getDictionary(lang);
  const posts = getAllPosts();
  const feed = new Feed({
    title: d.site.title,
    description: d.site.description,
    id: `${siteCore.url}/zh-Hant`,
    link: `${siteCore.url}/zh-Hant`,
    language: ogLocale[lang].replace("_", "-"),
    favicon: `${siteCore.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${siteCore.author.name}`,
    feedLinks: { rss2: `${siteCore.url}/zh-Hant/rss.xml` },
    author: { name: siteCore.author.name, link: siteCore.author.url },
  });

  for (const p of posts) {
    feed.addItem({
      id: `${siteCore.url}${localeHref(lang, `/blog/${p.slug}`)}`,
      link: `${siteCore.url}${localeHref(lang, `/blog/${p.slug}`)}`,
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
