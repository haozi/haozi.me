/**
 * Single source of truth for site-level metadata.
 * Keep this small — anything bigger belongs in its own module.
 */
export const site = {
  name: "耗子么",
  shortName: "haozi",
  title: "耗子么 · haozi.me",
  description: "耗子的个人主页与博客 — 复古首页、现代博客。",
  url: "https://haozi.me",
  locale: "zh-CN",
  author: {
    name: "耗子",
    handle: "haozi",
    url: "https://haozi.me",
  },
  nav: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/categories", label: "分类" },
  ],
  retroNav: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "https://github.com/haozi", label: "Github" },
    { href: "/posts/xss-fun", label: "XSS" },
    { href: "/posts/math-tricks", label: "Math" },
    { href: "/posts/jsonuri", label: "JSONURI" },
  ],
} as const;

export type Site = typeof site;
