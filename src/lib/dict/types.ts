/**
 * Dictionary shape — single source of truth derived from the English
 * dictionary. Every other locale must structurally satisfy this type;
 * adding a key in en.ts will produce TS errors in zh-Hans.ts / zh-Hant.ts
 * until they catch up. That's the desired safety net.
 */

export type Dictionary = {
  site: {
    title: string;
    shortName: string;
    description: string;
    tagline: string;
    welcome: string;
  };
  retro: {
    nav: {
      home: string;
      blog: string;
      github: string;
      xss: string;
      math: string;
      jsonuri: string;
    };
    intro: string;
    intro_line2: string;
    php_warning: string;
    wechat: string;
    recent_title: string;
    enter_blog: string;
    archive: string;
    tags: string;
    browser_advice: string;
    browser_advice_after: string;
    resolution_advice: string;
    bgm_on: string;
    bgm_off: string;
  };
  blog: {
    blog: string;
    archive: string;
    tags: string;
    categories: string;
    rss: string;
    home_pill: string;
    home_pill_long: string;
    rss_feed: string;
    all_posts: string;
    archive_arrow: string;
    featured: string;
    read_article: string;
    read_arrow: string;
    min_read: string;
    cols: {
      read: string;
      browse: string;
      author: string;
    };
    footer_built: string;
  };
  archive: {
    eyebrow: string;
    title: string;
    summary: (n: number) => string;
    year_count: (n: number) => string;
  };
  tags: {
    eyebrow: string;
    title: string;
    summary: (n: number) => string;
    posts_with_tag: (n: number) => string;
    all_tags: string;
    tag_label: string;
  };
  categories: {
    eyebrow: string;
    title: string;
    summary: (n: number) => string;
    posts_in_category: (n: number) => string;
    all_categories: string;
    category_label: string;
    uncategorized: string;
  };
  post: {
    back_to_blog: string;
    nav_label: string;
    prev: string;
    next: string;
  };
  notfound: {
    eyebrow: string;
    title: string;
    description: string;
    back_retro: string;
    go_blog: string;
  };
  search: {
    placeholder: string;
    loading: string;
    no_results: string;
  };
  switcher: {
    label: string;
  };
  date_locale: string;
};
