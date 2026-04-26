// Build a tiny static search index at build time. Output goes to
// public/search-index.json so it's served as a static asset (works with
// `output: "export"`). The runtime client (src/components/blog/Search.tsx)
// fetches it lazily on first interaction.
//
// Run with: `node scripts/build-search-index.mjs` — wired into `prebuild`.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const OUT = path.join(ROOT, "public", "search-index.json");

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUT, "[]");
    return;
  }
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const entries = files
    .map((f) => {
      const p = path.join(POSTS_DIR, f);
      const raw = fs.readFileSync(p, "utf8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const slug = f.replace(/\.(mdx|md)$/, "");
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        tags: data.tags ?? [],
        category: data.category ?? "",
        date: data.date ?? "",
        body: stripMarkdown(content).slice(0, 4000),
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(entries));
  console.log(`[search-index] wrote ${entries.length} entries → ${path.relative(ROOT, OUT)}`);
}

build();
