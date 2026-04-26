import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    { url: `${site.url}/blog`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/archive`, lastModified: now, priority: 0.5 },
    { url: `${site.url}/tags`, lastModified: now, priority: 0.5 },
    { url: `${site.url}/categories`, lastModified: now, priority: 0.5 },
  ];
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.frontmatter.updated ?? p.frontmatter.date),
    priority: 0.7,
  }));
  const tagEntries: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    priority: 0.4,
  }));
  const catEntries: MetadataRoute.Sitemap = getAllCategories().map(
    ({ category }) => ({
      url: `${site.url}/categories/${encodeURIComponent(category)}`,
      lastModified: now,
      priority: 0.4,
    }),
  );
  return [...fixed, ...postEntries, ...tagEntries, ...catEntries];
}
