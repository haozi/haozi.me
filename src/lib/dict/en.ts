import type { Dictionary } from "./types";

/**
 * English dictionary — the default locale and the source of truth for
 * dictionary shape. When adding a new key, add it here first; TypeScript
 * will then surface every other locale that hasn't been kept in sync.
 */
export const en: Dictionary = {
  site: {
    title: "haozi.me",
    shortName: "haozi",
    description:
      "Haozi's personal site & blog — a retro 1999 homepage and a calm 2026 reading room.",
    tagline: "Slow writing, slow reading.",
    welcome: "Welcome — now in 2026",
  },
  retro: {
    nav: {
      home: "::Home::",
      blog: "::Blog::",
      github: "::Github::",
      xss: "::XSS::",
      math: "::Math::",
      jsonuri: "::JSONURI::",
    },
    intro:
      "Hi, I'm Haozi, from Hangzhou. �����锴斤拷烫烫烫",
    intro_line2: "Travelling, petting dogs, petting dogs, petting dogs.",
    php_warning:
      "PHP Fatal error: Class 'Job' not found in /home/coder/35yo.php on line 996",
    wechat: "My WeChat",
    recent_title: "★ LATEST POSTS ★",
    enter_blog: "» Enter blog",
    archive: "» Archive",
    tags: "» Tags",
    browser_advice: "Best viewed in",
    browser_advice_after: "Internet Explorer 6.0",
    resolution_advice:
      "at 1024 × 768 resolution for the optimal experience",
    bgm_on: "♪ Music ON",
    bgm_off: "♪ Music OFF",
  },
  blog: {
    blog: "Blog",
    archive: "Archive",
    tags: "Tags",
    categories: "Categories",
    rss: "RSS",
    home_pill: "← 1999",
    home_pill_long: "← Back to 1999",
    rss_feed: "RSS Feed",
    all_posts: "All posts",
    archive_arrow: "Archive →",
    featured: "Featured",
    read_article: "Read article →",
    read_arrow: "Read →",
    min_read: "min read",
    footer_built: "Built with Next.js & MDX. Recovered from archive.org.",
    cols: {
      read: "Read",
      browse: "Browse",
      author: "Author",
    },
  },
  archive: {
    eyebrow: "Archive",
    title: "Archive",
    summary: (n: number) =>
      `${n} ${n === 1 ? "post" : "posts"} · grouped by year`,
    year_count: (n: number) => `${n} ${n === 1 ? "post" : "posts"}`,
  },
  tags: {
    eyebrow: "Tags",
    title: "Tags",
    summary: (n: number) => `${n} ${n === 1 ? "tag" : "tags"}`,
    posts_with_tag: (n: number) =>
      `${n} ${n === 1 ? "post" : "posts"} tagged`,
    all_tags: "← All tags",
    tag_label: "Tag",
  },
  categories: {
    eyebrow: "Categories",
    title: "Categories",
    summary: (n: number) =>
      `${n} ${n === 1 ? "category" : "categories"}`,
    posts_in_category: (n: number) =>
      `${n} ${n === 1 ? "post" : "posts"}`,
    all_categories: "← All categories",
    category_label: "Category",
    uncategorized: "Uncategorized",
  },
  post: {
    back_to_blog: "← Back to blog",
    nav_label: "Article navigation",
    prev: "← Previous (older)",
    next: "Next (newer) →",
  },
  notfound: {
    eyebrow: "404 · Not Found",
    title: "Page not found",
    description:
      "This page may have been swallowed by a PHP warning somewhere.",
    back_retro: "← Back to the retro home",
    go_blog: "Go read the blog →",
  },
  search: {
    placeholder: "Search posts…",
    loading: "Loading index…",
    no_results: "No matches",
  },
  switcher: {
    label: "Language",
  },
  date_locale: "en-US",
} as const;
