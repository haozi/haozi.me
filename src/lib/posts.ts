import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostFrontmatter = {
  title: string;
  date: string; // ISO yyyy-mm-dd
  updated?: string;
  description?: string;
  tags?: string[];
  category?: string;
  draft?: boolean;
  cover?: string;
  toc?: boolean;
};

export type Post = {
  slug: string;
  filepath: string;
  frontmatter: PostFrontmatter;
  content: string; // raw mdx body
  readingTimeMinutes: number;
  wordCount: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function listMdxFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(POSTS_DIR, f));
}

function fileToPost(filepath: string): Post {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const slug = path.basename(filepath).replace(/\.(md|mdx)$/, "");
  const stats = readingTime(content);
  const fm = data as PostFrontmatter;
  if (!fm.title) {
    throw new Error(`[posts] missing title in ${filepath}`);
  }
  if (!fm.date) {
    throw new Error(`[posts] missing date in ${filepath}`);
  }
  return {
    slug,
    filepath,
    frontmatter: fm,
    content,
    readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
  };
}

let _cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (_cache) return _cache;
  const files = listMdxFiles();
  const posts = files
    .map(fileToPost)
    .filter((p) => !p.frontmatter.draft || process.env.NODE_ENV !== "production")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
    );
  _cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const t of p.frontmatter.tags ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    const c = p.frontmatter.category ?? "未分类";
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => (p.frontmatter.tags ?? []).includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (p) => (p.frontmatter.category ?? "未分类") === category,
  );
}

export function getArchive(): { year: string; posts: Post[] }[] {
  const buckets = new Map<string, Post[]>();
  for (const p of getAllPosts()) {
    const year = String(new Date(p.frontmatter.date).getFullYear());
    const arr = buckets.get(year) ?? [];
    arr.push(p);
    buckets.set(year, arr);
  }
  return [...buckets.entries()]
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getAdjacentPosts(slug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  // all is sorted desc by date; "prev" article = older = i+1, "next" = newer = i-1
  return {
    prev: all[i + 1] ?? null,
    next: all[i - 1] ?? null,
  };
}
