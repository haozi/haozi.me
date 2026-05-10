import type { Dictionary } from "./types";

/**
 * Traditional Chinese dictionary. Hand-translated from the Simplified
 * source — not OpenCC-derived. If the author wants stricter Taiwan vs
 * Hong Kong vocabulary later, split this further.
 */
export const zhHant: Dictionary = {
  site: {
    title: "耗子麼 · haozi.me",
    shortName: "haozi",
    description: "耗子的個人主頁與部落格 — 復古首頁、現代部落格。",
    tagline: "慢慢寫，慢慢讀。",
    welcome: "歡迎來到 — 2026",
  },
  retro: {
    nav: {
      home: "::首頁::",
      blog: "::部落格::",
      github: "::Github::",
      xss: "::XSS::",
      math: "::Math::",
      jsonuri: "::JSONURI::",
    },
    intro:
      "  大家好，我是耗子，來自杭州。�����锴斤拷烫烫烫",
    intro_line2: "愛好旅行、擼狗、擼狗、擼狗",
    php_warning:
      "PHP Fatal error: Class 'Job' not found in /home/coder/35yo.php on line 996",
    wechat: "我的微信",
    recent_title: "★ 最 新 日 誌 ★",
    enter_blog: "» 進入部落格",
    archive: "» 封存",
    tags: "» 標籤",
    browser_advice: "本站最佳瀏覽器建議升級至",
    browser_advice_after: "Internet Explorer 6.0",
    resolution_advice: "並使用 1024 × 768 解析度以取得最佳瀏覽體驗",
    bgm_on: "♪ 背景音樂 開",
    bgm_off: "♪ 背景音樂 關",
  },
  blog: {
    blog: "部落格",
    archive: "封存",
    tags: "標籤",
    categories: "分類",
    rss: "RSS",
    home_pill: "← 1999",
    home_pill_long: "← 回到 1999",
    rss_feed: "RSS 訂閱",
    all_posts: "所有文章",
    archive_arrow: "封存 →",
    featured: "精選",
    read_article: "閱讀全文 →",
    read_arrow: "閱讀 →",
    min_read: "分鐘閱讀",
    footer_built: "由 Next.js 與 MDX 建構 · 部分內容自 archive.org 搶救而來",
    cols: {
      read: "閱讀",
      browse: "瀏覽",
      author: "作者",
    },

  },
  archive: {
    eyebrow: "Archive",
    title: "封存",
    summary: (n: number) => `共 ${n} 篇 · 依年份排列`,
    year_count: (n: number) => `${n} 篇`,
  },
  tags: {
    eyebrow: "Tags",
    title: "標籤",
    summary: (n: number) => `${n} 個標籤`,
    posts_with_tag: (n: number) => `${n} 篇文章帶有此標籤`,
    all_tags: "← 所有標籤",
    tag_label: "Tag",
  },
  categories: {
    eyebrow: "Categories",
    title: "分類",
    summary: (n: number) => `${n} 個分類`,
    posts_in_category: (n: number) => `${n} 篇文章`,
    all_categories: "← 所有分類",
    category_label: "Category",
    uncategorized: "未分類",
  },
  post: {
    back_to_blog: "← 返回部落格",
    nav_label: "文章導覽",
    prev: "← 上一篇（較舊）",
    next: "下一篇（較新）→",
  },
  notfound: {
    eyebrow: "404 · Not Found",
    title: "找不到頁面",
    description: "這一頁可能在某個 PHP warning 後面被吞掉了。",
    back_retro: "← 回懷舊首頁",
    go_blog: "去看部落格 →",
  },
  search: {
    placeholder: "搜尋文章…",
    loading: "正在載入索引…",
    no_results: "沒有符合的結果",
  },
  switcher: {
    label: "語言",
  },
  date_locale: "zh-TW",
} as const;
