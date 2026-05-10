import type { Dictionary } from "./types";

/**
 * Simplified Chinese dictionary. Mirrors the original Chinese-flavoured
 * copy that lived inline in the components before i18n landed.
 */
export const zhHans: Dictionary = {
  site: {
    title: "耗子么 · haozi.me",
    shortName: "haozi",
    description: "耗子的个人主页与博客 — 复古首页、现代博客。",
    tagline: "慢慢写，慢慢读。",
    welcome: "欢迎来到 — 2026",
  },
  retro: {
    nav: {
      home: "::首页::",
      blog: "::博客::",
      github: "::Github::",
      xss: "::XSS::",
      math: "::Math::",
      jsonuri: "::JSONURI::",
    },
    intro:
      "  大家好，我是耗子，来自杭州。�����锴斤拷烫烫烫",
    intro_line2: "爱好旅行、撸狗、撸狗、撸狗",
    php_warning:
      "PHP Fatal error: Class 'Job' not found in /home/coder/35yo.php on line 996",
    wechat: "我的微信",
    recent_title: "★ 最 新 日 志 ★",
    enter_blog: "» 进入博客",
    archive: "» 归档",
    tags: "» 标签",
    browser_advice: "本站最佳浏览器建议升级到",
    browser_advice_after: "Internet Explorer 6.0",
    resolution_advice: "并使用 1024 × 768 分辨率以获得最佳浏览体验",
    bgm_on: "♪ 背景音乐 开",
    bgm_off: "♪ 背景音乐 关",
  },
  blog: {
    blog: "博客",
    archive: "归档",
    tags: "标签",
    categories: "分类",
    rss: "RSS",
    home_pill: "← 1999",
    home_pill_long: "← 回到 1999",
    rss_feed: "RSS 订阅",
    all_posts: "所有文章",
    archive_arrow: "归档 →",
    featured: "精选",
    read_article: "阅读全文 →",
    read_arrow: "阅读 →",
    min_read: "分钟阅读",
    footer_built: "由 Next.js 与 MDX 构建 · 部分内容自 archive.org 抢救而来",
    cols: {
      read: "阅读",
      browse: "浏览",
      author: "作者",
    },
  },
  archive: {
    eyebrow: "Archive",
    title: "归档",
    summary: (n: number) => `共 ${n} 篇 · 按年份排列`,
    year_count: (n: number) => `${n} 篇`,
  },
  tags: {
    eyebrow: "Tags",
    title: "标签",
    summary: (n: number) => `${n} 个标签`,
    posts_with_tag: (n: number) => `${n} 篇文章带有此标签`,
    all_tags: "← 所有标签",
    tag_label: "Tag",
  },
  categories: {
    eyebrow: "Categories",
    title: "分类",
    summary: (n: number) => `${n} 个分类`,
    posts_in_category: (n: number) => `${n} 篇文章`,
    all_categories: "← 所有分类",
    category_label: "Category",
    uncategorized: "未分类",
  },
  post: {
    back_to_blog: "← 返回博客",
    nav_label: "文章导航",
    prev: "← 上一篇（更旧）",
    next: "下一篇（更新）→",
  },
  notfound: {
    eyebrow: "404 · Not Found",
    title: "页面没找到",
    description: "这一页可能在某个 PHP warning 后面被吞掉了。",
    back_retro: "← 回怀旧首页",
    go_blog: "去看博客 →",
  },
  search: {
    placeholder: "搜索文章…",
    loading: "加载索引中…",
    no_results: "没有匹配结果",
  },
  switcher: {
    label: "语言",
  },
  date_locale: "zh-CN",
} as const;
