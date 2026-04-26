import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * RSS feed. With `output: "export"` Next will render this once at build time
 * into `out/rss.xml/index.xml` — but because of `trailingSlash: true` we want
 * the URL `/rss.xml` to resolve. We solve that with a `_redirects`-equivalent:
 * the Next route handler emits a static `rss.xml` file at the root via
 * dynamic = "force-static" + the route name `/rss.xml/route.ts`.
 */
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: site.url,
    language: site.locale,
    favicon: `${site.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${site.author.name}`,
    feedLinks: { rss2: `${site.url}/rss.xml` },
    author: {
      name: site.author.name,
      link: site.author.url,
    },
  });

  for (const p of posts) {
    feed.addItem({
      id: `${site.url}/blog/${p.slug}`,
      link: `${site.url}/blog/${p.slug}`,
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
