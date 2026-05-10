#!/usr/bin/env node
/**
 * scripts/migrate-archive.mjs
 *
 * One-shot ETL: fetch archived blog posts of haozi.cc / haozi.me from
 * web.archive.org, parse them, convert to MDX, and write into
 * content/posts/ with original publish dates preserved.
 *
 * Implementation notes:
 * - The Wayback Machine front-end shows "Temporarily Offline" but the
 *   /web/{ts}id_/{url} content endpoint still returns clean raw HTML
 *   (no IA toolbar injected). We use that.
 * - Cross-domain dedupe by parsed `id="post-{N}"`: when haozi.cc → haozi.me
 *   migrated in 2011 the WP post IDs were preserved, so /post/543.html on
 *   both domains is the same article. We pick the version with a parsed
 *   date and longer body.
 * - Three template families covered by ONE unified WordPress parser
 *   (which probes multiple title/date/body selectors), plus a separate
 *   Hexo NeXT parser for the 2018 era.
 * - Image URLs pointing to haozi.cc / haozi.me are rewritten to wayback
 *   so they keep loading.
 * - Idempotent: at start, deletes any content/posts/*.mdx whose frontmatter
 *   declares `archived: true`. Hand-written posts are left alone.
 *
 * Run: pnpm exec node scripts/migrate-archive.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import TurndownService from "turndown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");

// ----- INVENTORY -----------------------------------------------------------
// Tuples: [domain, urlPath, archivedTs]

const INVENTORY = [
  // === haozi.cc 2010 (slug-based) ===
  ["cc", "/post/35-essential-wordpress-plugins.html", "20100329115820"],
  ["cc", "/post/0214007895555.html", "20100601040303"],
  ["cc", "/post/310569138.html", "20100823075024"],
  ["cc", "/post/360andqq.html", "20101114002001"],
  ["cc", "/post/360vsqq.html", "20101208055408"],
  ["cc", "/post/54-summary-of-human.html", "20100525042458"],
  ["cc", "/post/61-132-221-146.html", "20100525044004"],
  ["cc", "/post/80hou.html", "20100803073147"],
  ["cc", "/post/antibaidu.html", "20100902152316"],
  ["cc", "/post/backbround-white.html", "20100810074615"],
  ["cc", "/post/baidu-sitemap-generator.html", "20100707124612"],
  ["cc", "/post/bressanon.html", "20100525042503"],
  ["cc", "/post/css-framework-for-selection-of-15-foreign-countries.html", "20100807074433"],
  ["cc", "/post/css-hacks-written.html", "20100808091356"],
  ["cc", "/post/css-triangle.html", "20100810005853"],
  ["cc", "/post/days-with-my-father.html", "20100707122837"],
  ["cc", "/post/dedecms.html", "20100803071519"],
  ["cc", "/post/div-li.html", "20101028112514"],
  ["cc", "/post/domain-cc.html", "20100707143816"],
  ["cc", "/post/domain.html", "20100823075029"],
  ["cc", "/post/drinking%E5%81%B6%E6%84%9F.html", "20100604105959"],
  ["cc", "/post/fanfou.html", "20101207005644"],
  ["cc", "/post/fangdichan.html", "20101128092814"],
  ["cc", "/post/folder-hidden.html", "20101028112519"],
  ["cc", "/post/future-web.html", "20100911232648"],
  ["cc", "/post/germany.html", "20100803073157"],
  ["cc", "/post/ggssl.html", "20100803071607"],
  ["cc", "/post/ghostxp.html", "20100707122853"],
  ["cc", "/post/good-ovies.html", "20100525042509"],
  ["cc", "/post/goodbye-google.html", "20100803005656"],
  ["cc", "/post/googlepr.html", "20101028112525"],
  ["cc", "/post/guodegang.html", "20100823075115"],
  ["cc", "/post/home-and-country-hate-short-the-daughter-of-love.html", "20100808012655"],
  ["cc", "/post/html5.html", "20100823064411"],
  ["cc", "/post/huluobo.html", "20100525044024"],
  ["cc", "/post/ie6-png.html", "20100603064609"],
  ["cc", "/post/jianzhi.html", "20100902151437"],
  ["cc", "/post/jquery.html", "20100707130902"],
  ["cc", "/post/kanghan.html", "20100803210331"],
  ["cc", "/post/liuliang.html", "20100823064406"],
  ["cc", "/post/make-life-get-better.html", "20100525042515"],
  ["cc", "/post/man-2.html", "20100707130916"],
  ["cc", "/post/man.html", "20100514150125"],
  ["cc", "/post/mar-8.html", "20100810123408"],
  ["cc", "/post/meizum9.html", "20110115073539"],
  ["cc", "/post/myphone.html", "20100803073202"],
  ["cc", "/post/operation.html", "20100902151518"],
  ["cc", "/post/phptutorial.html", "20100822172929"],
  ["cc", "/post/poetry.html", "20100707130929"],
  ["cc", "/post/psd1.html", "20100903001434"],
  ["cc", "/post/q-online-code.html", "20100525042749"],
  ["cc", "/post/qinhuaihe.html", "20100823064422"],
  ["cc", "/post/recently.html", "20100707125037"],
  ["cc", "/post/safe-web.html", "20100803073208"],
  ["cc", "/post/sanxia.html", "20100803073212"],
  ["cc", "/post/seostudy.html", "20100823075034"],
  ["cc", "/post/sex-test.html", "20100525042521"],
  ["cc", "/post/shiyishou.html", "20101028112530"],
  ["cc", "/post/suibi.html", "20100902151523"],
  ["cc", "/post/switchy.html", "20100822172954"],
  ["cc", "/post/t-qq.html", "20100525042536"],
  ["cc", "/post/ten-mistakes-of-css.html", "20100807074438"],
  ["cc", "/post/web-page-written-in-the-vertical-center.html", "20100516141336"],
  ["cc", "/post/what-is-happiness.html", "20100803073217"],
  ["cc", "/post/yellowweb.html", "20100823075126"],
  ["cc", "/post/zhengqianhua.html", "20110318173127"],
  ["cc", "/post/%E6%8A%8A%E6%89%8B%E6%9C%BA%E7%9A%84m%E5%80%BC%E6%8F%90%E7%8E%B0%E4%BA%86.html", "20100803073101"],

  // === haozi.cc 2010 (numeric early posts) ===
  ["cc", "/post/2", "20100115084428"],
  ["cc", "/post/4/", "20100123094419"],
  ["cc", "/post/5/", "20100123060641"],
  ["cc", "/post/10/", "20100123060333"],
  ["cc", "/post/11/", "20100201132016"],
  ["cc", "/post/12/", "20100123042610"],
  ["cc", "/post/13/", "20100123042121"],
  ["cc", "/post/14/", "20100123042014"],
  ["cc", "/post/15/", "20100123042532"],
  ["cc", "/post/16/", "20100123042548"],
  ["cc", "/post/18/", "20100201041848"],
  ["cc", "/post/19/", "20100201041853"],
  ["cc", "/post/21/", "20100201042144"],
  ["cc", "/post/22/", "20100201042043"],
  ["cc", "/post/24/", "20100201041858"],
  ["cc", "/post/25/", "20100201042048"],
  ["cc", "/post/26", "20100128102338"],
  ["cc", "/post/28", "20100128102053"],
  ["cc", "/post/29/", "20100201042120"],

  // === haozi.me 2011-2012 (Inove WP) ===
  ["me", "/post/183.html", "20111224011312"],
  ["me", "/post/221.html", "20111128075656"],
  ["me", "/post/230.html", "20111123195330"],
  ["me", "/post/236.html", "20111128074856"],
  ["me", "/post/344.html", "20120110122724"],
  ["me", "/post/363.html", "20120121171934"],
  ["me", "/post/365.html", "20120120004727"],
  ["me", "/post/368.html", "20120121172001"],
  ["me", "/post/543.html", "20111119134830"],
  ["me", "/post/548.html", "20111119125817"],
  ["me", "/post/558.html", "20111119140717"],
  ["me", "/post/570.html", "20111224011555"],
  ["me", "/post/576.html", "20111029092353"],
  ["me", "/post/578.html", "20111028173138"],
  ["me", "/post/581.html", "20111029092400"],
  ["me", "/post/593.html", "20111119140529"],
  ["me", "/post/690.html", "20111119140551"],
  ["me", "/post/716.html", "20111031102643"],
  ["me", "/post/718.html", "20111030213833"],

  // === haozi.me 2010 Librio ===
  ["me", "/blog/archives/46", "20100412010944"],
  ["me", "/blog/archives/89", "20100419143115"],

  // === haozi.me 2014-2015 (rebranded WP, /post-N + .entry) ===
  ["me", "/archives/58", "20140410051541"],
  ["me", "/google-glass/", "20140616222526"],
  ["me", "/2015/01/04/299.html", "20150115211843"],
  ["me", "/%E8%BF%90%E8%90%A5%E5%93%81%E7%89%8C%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E7%9A%84%E4%BA%94%E5%A4%A7%E5%85%B3%E9%94%AE%E8%A6%81%E7%B4%A0/", "20140411165205"],

  // === haozi.me 2018 Hexo NeXT ===
  ["me", "/post/check-global-variable.html", "20180711024014"],
  ["me", "/post/hometown.html", "20180711015547"],
];

// ----- STRING / DATE HELPERS ----------------------------------------------

function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&raquo;/g, "»")
    .replace(/&laquo;/g, "«")
    .replace(/&nbsp;/g, " ");
}

function normalizeWhitespace(s) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function iso(y, mo, d) {
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const CN_MONTH = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6,
  七: 7, 八: 8, 九: 9, 十: 10,
  十一: 11, 十二: 12,
};
const EN_MONTH = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function parseChineseDate(text) {
  if (!text) return null;
  const t = normalizeWhitespace(text);
  // YYYY 年 M 月 D 日 (Chinese)
  let m = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  // YYYY-MM-DD / YYYY/MM/DD / YYYY.MM.DD (year-first)
  m = t.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  // M/D/YYYY (US, e.g. "by 浩子 on 04/4/2014")
  m = t.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (m) return iso(+m[3], +m[1], +m[2]);
  // English long form
  m = t.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})/i);
  if (m) return iso(+m[3], EN_MONTH[m[1].toLowerCase()], +m[2]);
  return null;
}

/**
 * Parse the inove `<span class="published">月N{0,2}<br><strong>YYYY</strong></span>` form,
 * e.g. "一06\n2011" → 2011-01-06, "十二04\n2011" → 2011-12-04.
 * Year is provided separately (extracted from <strong> via caller).
 */
function parseCnPublishedText(text, year) {
  if (!text || !year) return null;
  const t = text.replace(/\s+/g, "").trim(); // e.g. "一062011"
  // strip year suffix if present in text
  const stripped = t.replace(String(year), "");
  // match leading Chinese month chars + trailing day digits
  const m = stripped.match(/^(十[一二]|[一二三四五六七八九十])(\d{1,2})$/);
  if (!m) return null;
  const month = CN_MONTH[m[1]];
  const day = +m[2];
  if (!month || !day) return null;
  return iso(year, month, day);
}

function urlDate(urlPath) {
  // /YYYY/MM/DD/ — preserves date when DOM date is missing
  const m = urlPath.match(/\/(\d{4})\/(\d{1,2})\/(\d{1,2})\//);
  if (m) return iso(+m[1], +m[2], +m[3]);
  return null;
}

function rewriteImagesToWayback(html, ts) {
  if (!html) return html;
  return html.replace(
    /(\s(?:src|href)=["'])(https?:\/\/(?:www\.)?haozi\.(?:cc|me)[^"']*)/gi,
    (_, pre, url) => `${pre}https://web.archive.org/web/${ts}im_/${url}`,
  );
}

// ----- TEMPLATE PARSERS ----------------------------------------------------

/**
 * Unified WordPress parser. Handles three theme variants we observed:
 *   - Inove / haozi-clone (haozi.cc 2010, haozi.me 2011-2012)
 *   - Librio (haozi.me /blog/archives/N, 2010)
 *   - 2014-WP rebrand (haozi.me /post-N + .entry, 2014-2015)
 * All three share the `<div class="post" id="post-N">` shell.
 */
function parseWordPressPost($, fallbackTitle) {
  const $post = $("div.post[id^='post-']").first();
  if ($post.length === 0) return null;

  const idMatch = ($post.attr("id") || "").match(/post-(\d+)/);
  const postId = idMatch ? idMatch[1] : null;

  // ---- Title ----
  let title = normalizeWhitespace(
    $post.find("> h2, > h1, > .post-title, h1.post-title, h2.entry-title, h1.entry-title").first().text(),
  );
  if (!title) title = fallbackTitle;

  // ---- Date (try in priority order) ----
  let date = null;

  // 1) <span class="date">YYYY年M月D日</span>  (or "by X on M/D/YYYY")
  // Note: bare `.date` descendant included for the 2014-WP variant where the
  // span has no .info wrapper (e.g. "<span class='date'>by 浩子 on 04/4/2014</span>").
  const cn1 = $post.find(".info .date, .post-info .date, > .date, .entry-date, .date").first().text();
  date = date || parseChineseDate(cn1);

  // 2) <span class="published">[Chinese month][day]<br><strong>YYYY</strong></span>
  if (!date) {
    const $pub = $post.find(".published, .entry-published, .info .published").first();
    if ($pub.length > 0) {
      const html = $pub.html() || "";
      const yearM = html.match(/<strong>\s*(\d{4})\s*<\/strong>/);
      const txt = normalizeWhitespace($pub.text());
      date = parseCnPublishedText(txt, yearM ? +yearM[1] : null);
    }
  }

  // 3) <abbr class="published" title="2011-09-...">
  if (!date) {
    const abbr = $post.find("abbr.published, abbr[title*='-']").attr("title");
    if (abbr) {
      const m = abbr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (m) date = iso(+m[1], +m[2], +m[3]);
    }
  }

  // 4) Free text in .post-info / .entry-meta
  if (!date) {
    const txt = $post.find(".post-info, .entry-meta, .post-meta, .meta").first().text();
    date = parseChineseDate(txt);
  }

  // 5) <time datetime=> or meta property
  if (!date) {
    const dt =
      $post.find("time[datetime]").attr("datetime") ||
      $('meta[property="article:published_time"]').attr("content");
    if (dt) {
      const m = dt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (m) date = iso(+m[1], +m[2], +m[3]);
    }
  }

  // ---- Body ----
  let $body = $post
    .find("> .content, > .entry, > .entry-content, > .post-content")
    .first();

  if ($body.length === 0) {
    // Last-resort: clone the post DIV and strip non-body sections.
    const $clone = $post.clone();
    $clone
      .find(
        "h1, h2.entry-title, h1.entry-title, h1.post-title, h2.post-title, .info, .post-info, .under, .entry-meta, .post-meta, .navigation, .comments, .sharedaddy, script",
      )
      .remove();
    $body = $clone;
  } else {
    $body
      .find("script, .sharedaddy, .jp-relatedposts, .post-share, .navigation")
      .remove();
  }

  const bodyHtml = $body.html() || "";

  // ---- Cats / Tags ----
  const cats = uniq(
    $post.find("a[rel='category tag']").map((_, el) => normalizeWhitespace($(el).text())).get(),
  );
  const tags = uniq(
    $post
      .find("a[rel='tag']:not([rel*='category'])")
      .map((_, el) => normalizeWhitespace($(el).text()))
      .get(),
  );

  return { postId, title, date, bodyHtml, categories: cats, tags };
}

/** Hexo NeXT theme — haozi.me 2018 era */
function parseHexoNext($, fallbackTitle) {
  const $art = $("article").first();
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const title =
    normalizeWhitespace(ogTitle) ||
    normalizeWhitespace($art.find("h1.post-title").first().text()) ||
    fallbackTitle;

  let date = null;
  const dt =
    $('time[itemprop="dateCreated"]').attr("datetime") ||
    $('meta[property="article:published_time"]').attr("content") ||
    $("time").first().attr("datetime");
  if (dt) {
    const m = dt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) date = iso(+m[1], +m[2], +m[3]);
  }

  let $body = $art.find(".post-body").first();
  if ($body.length === 0) $body = $("div.post-body").first();
  $body.find("script, .post-copyright, .post-nav").remove();
  const bodyHtml = $body.html() || "";

  const cats = uniq(
    $('.post-meta-categories a, [itemprop="articleSection"]')
      .map((_, el) => normalizeWhitespace($(el).text()))
      .get(),
  );
  const tags = uniq(
    $('.post-meta-tags a, [rel="tag"]')
      .map((_, el) => normalizeWhitespace($(el).text()))
      .get(),
  );

  return { postId: null, title, date, bodyHtml, categories: cats, tags };
}

function parsePost(html) {
  const $ = load(html, { decodeEntities: false });
  const titleTag = normalizeWhitespace($("title").text());
  const fallbackTitle = decodeEntities(titleTag.split(/[»|–—-]/)[0].trim());

  const generator = $('meta[name="generator"]').attr("content") || "";
  const isHexo = /Hexo/i.test(generator) || $(".post-body").length > 0;

  const parsed = isHexo ? parseHexoNext($, fallbackTitle) : parseWordPressPost($, fallbackTitle);
  if (!parsed) return null;
  parsed.title = decodeEntities(parsed.title || "").trim();
  return parsed;
}

// ----- MD CONVERSION + WRITE ----------------------------------------------

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "_",
    fence: "```",
    hr: "---",
  });
  td.addRule("strip-empty", {
    filter: (node) =>
      node.nodeName === "P" &&
      !node.textContent.trim() &&
      node.querySelectorAll("img").length === 0,
    replacement: () => "",
  });
  td.addRule("pre-block", {
    filter: ["pre"],
    replacement: (_content, node) => {
      const code = node.querySelector("code");
      const langCls = code?.className || node.className || "";
      const lang = (langCls.match(/(?:language-|lang-|brush:\s*)([\w+\-]+)/) || [, ""])[1] || "";
      const txt = (code ? code.textContent : node.textContent).replace(/\n+$/, "");
      return `\n\n\`\`\`${lang}\n${txt}\n\`\`\`\n\n`;
    },
  });
  td.addRule("ifr-keep", {
    filter: "iframe",
    replacement: (_c, node) => {
      const src = node.getAttribute("src") || "";
      return src ? `\n\n[嵌入: ${src}](${src})\n\n` : "";
    },
  });
  return td;
}

function fmYaml(fm) {
  const lines = [];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}: [${v.map(yamlStr).join(", ")}]`);
    } else if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yamlStr(String(v))}`);
    }
  }
  return lines.join("\n");
}

function yamlStr(s) {
  if (
    /^[\w\-./]+$/.test(s) &&
    !/^(true|false|yes|no|on|off|null|~)$/i.test(s) &&
    !/^\d/.test(s)
  ) {
    return s;
  }
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function pickIdentifier(parsed, urlPath) {
  // Numeric post ID → cross-domain canonical: post-{N}
  if (parsed.postId) return `post-${parsed.postId}`;
  // /post/foo.html → foo
  let m = urlPath.match(/\/post\/([^/]+)\.html$/);
  if (m) return slugify(decodeURIComponent(m[1]));
  // /YYYY/MM/DD/N.html → post-N
  m = urlPath.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/(\d+)\.html$/);
  if (m) return `post-${m[4]}`;
  // /archives/N or /blog/archives/N
  m = urlPath.match(/\/archives\/(\d+)\b/);
  if (m) return `post-${m[1]}`;
  // /post/N or /N
  m = urlPath.match(/\/(\d+)\/?$/);
  if (m) return `post-${m[1]}`;
  // /post/{slug}/  or /{slug}/
  m = urlPath.match(/\/post\/([^/]+)\/?$/);
  if (m) return slugify(decodeURIComponent(m[1]));
  m = urlPath.match(/\/([^/]+)\/?$/);
  if (m) return slugify(decodeURIComponent(m[1]));
  return "post-unknown";
}

function slugify(s) {
  return (
    s
      .toLowerCase()
      .replace(/&[a-z0-9]+;/g, "")
      .replace(/[^a-z0-9一-龥]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post"
  );
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function entryScore(parsed) {
  let s = 0;
  if (parsed.date) s += 1_000_000; // strongly prefer entries that have a date
  s += (parsed.bodyHtml || "").length;
  return s;
}

function buildMdx(entry) {
  const { parsed, urlPath, dom, ts } = entry;
  const fm = {
    title: parsed.title,
    date: parsed.date || urlDate(urlPath) || "2010-01-01",
    description: parsed.description || undefined,
    category: parsed.categories?.[0] || "归档",
    tags: uniq([...(parsed.tags || []), ...((parsed.categories || []).slice(1))]),
    archived: true,
    sourceUrl: `http://${dom === "cc" ? "haozi.cc" : "haozi.me"}${urlPath}`,
  };
  const yaml = fmYaml(fm);
  const td = makeTurndown();
  const cleanedHtml = rewriteImagesToWayback(parsed.bodyHtml || "", ts);
  let body = td.turndown(cleanedHtml || "").trim();
  body = body.replace(/\n{3,}/g, "\n\n");
  body = sanitizeForMdx(body);
  return `---\n${yaml}\n---\n\n${body}\n`;
}

/**
 * MDX 3 (acorn-based) reads `{...}` as a JSX expression and `<TagName>`
 * as an opening JSX tag that needs closing. Old WordPress articles full
 * of PHP variables (`{$this->TypeID}`) or HTML tag mentions (`<pre>`)
 * blow up the parser. We escape outside fenced/inline code spans:
 *   - `{` → `\{`, `}` → `\}` (markdown literal-brace escape)
 *   - `<` → `&lt;` when followed by an HTML-tag-looking char
 * The function is idempotent: existing `\{ \} \< \>` and `&entity;`
 * sequences are passed through unchanged.
 */
function sanitizeForMdx(body) {
  let out = "";
  let i = 0;
  while (i < body.length) {
    // Fenced code block: ```lang\n...\n```
    if (body.slice(i, i + 3) === "```") {
      const end = body.indexOf("\n```", i + 3);
      if (end !== -1) {
        const codeEnd = end + 4;
        out += body.slice(i, codeEnd);
        i = codeEnd;
        continue;
      }
    }
    // Inline code (single line, ≤200 chars): `...`
    if (body[i] === "`") {
      const end = body.indexOf("`", i + 1);
      if (end !== -1 && end - i < 200) {
        out += body.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }
    // Preserve already-escaped sequences: \{ \} \< \>
    if (body[i] === "\\" && /[{}<>]/.test(body[i + 1] || "")) {
      out += body[i] + body[i + 1];
      i += 2;
      continue;
    }
    // Preserve existing HTML entities (&lt; &amp; &#10; &#xA0; etc.)
    if (body[i] === "&") {
      const m = body.slice(i, i + 12).match(/^&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/);
      if (m) {
        out += m[0];
        i += m[0].length;
        continue;
      }
    }
    const ch = body[i];
    if (ch === "{") {
      out += "\\{";
    } else if (ch === "}") {
      out += "\\}";
    } else if (ch === "<") {
      // Escape if it could trip the MDX JSX parser:
      //   - <tag>, </tag>, <!-- (letter / slash / bang)
      //   - <[link](url)> patterns turndown emits when wrapping anchor names
      //     with linked tag references (e.g. <[html](http://december.com/...)>)
      // Other contexts (lone `<` between digits etc.) we leave alone.
      const next = body[i + 1] || "";
      if (/[A-Za-z!/\[]/.test(next)) out += "&lt;";
      else out += "<";
    } else {
      out += ch;
    }
    i++;
  }
  return out;
}

function ensureUniqueSlug(slug, used) {
  let s = slug;
  let n = 2;
  while (used.has(s)) s = `${slug}-${n++}`;
  used.add(s);
  return s;
}

// ----- HTTP / CONCURRENCY --------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (haozi-archive-recovery; +haozi.me)" },
      });
      if (res.status === 200) return await res.text();
      if (res.status === 429 || res.status >= 500) {
        await sleep(800 * (i + 1));
        continue;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      if (i === attempts - 1) throw e;
      await sleep(800 * (i + 1));
    }
  }
  throw new Error("unreachable");
}

async function fetchPost([dom, urlPath, ts]) {
  const host = dom === "cc" ? "haozi.cc" : "haozi.me";
  const original = `http://${host}${urlPath}`;
  const wb = `https://web.archive.org/web/${ts}id_/${original}`;
  const html = await fetchOnce(wb);
  return { dom, urlPath, ts, host, html };
}

async function pmap(items, n, fn) {
  const out = [];
  let idx = 0;
  const workers = Array.from({ length: n }, async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        out[i] = await fn(items[i], i);
      } catch (e) {
        out[i] = { __error: e.message, __item: items[i] };
      }
    }
  });
  await Promise.all(workers);
  return out;
}

// ----- HOUSEKEEPING --------------------------------------------------------

function cleanArchivedPosts() {
  if (!fs.existsSync(POSTS_DIR)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith(".mdx") && !f.endsWith(".md")) continue;
    const p = path.join(POSTS_DIR, f);
    const head = fs.readFileSync(p, "utf8").slice(0, 2000);
    if (head.startsWith("---") && /^archived:\s*true\b/m.test(head)) {
      fs.unlinkSync(p);
      n++;
    }
  }
  return n;
}

// ----- MAIN ----------------------------------------------------------------

async function main() {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const removed = cleanArchivedPosts();
  if (removed) console.log(`▎cleaned ${removed} previously-archived MDX file(s)`);

  console.log(`▎fetching ${INVENTORY.length} archived URLs (concurrency=4)…`);

  const fetched = await pmap(INVENTORY, 4, async (it) => {
    const r = await fetchPost(it);
    process.stdout.write(`. ${it[0]}${it[1]} (${r.html.length}B)\n`);
    return r;
  });

  const byKey = new Map();
  let ok = 0;
  let err = 0;
  let skip = 0;
  for (const r of fetched) {
    if (r.__error) {
      err++;
      console.warn(`  ✗ ${r.__item?.[0]}${r.__item?.[1]} :: ${r.__error}`);
      continue;
    }
    let parsed;
    try {
      parsed = parsePost(r.html);
    } catch (e) {
      err++;
      console.warn(`  ✗ parse ${r.urlPath} :: ${e.message}`);
      continue;
    }
    if (!parsed || !parsed.title || !parsed.bodyHtml || parsed.bodyHtml.length < 30) {
      skip++;
      console.warn(`  ⚠ skip ${r.dom}${r.urlPath} (no body)`);
      continue;
    }

    const idKey = pickIdentifier(parsed, r.urlPath);
    const score = entryScore(parsed);
    const cur = byKey.get(idKey);
    if (cur && cur.score >= score) continue;
    byKey.set(idKey, { score, parsed, urlPath: r.urlPath, dom: r.dom, ts: r.ts, slug: idKey });
    ok++;
  }

  console.log(`▎parsed: ${ok} accepted, ${skip} skipped, ${err} errors, ${byKey.size} unique posts`);

  const used = new Set();
  for (const entry of [...byKey.values()].sort((a, b) =>
    (a.parsed.date || "9999").localeCompare(b.parsed.date || "9999"),
  )) {
    const slug = ensureUniqueSlug(entry.slug, used);
    const file = path.join(POSTS_DIR, `${slug}.mdx`);
    const out = buildMdx(entry);
    fs.writeFileSync(file, out, "utf8");
    const d = entry.parsed.date || urlDate(entry.urlPath) || "?";
    console.log(`  → ${slug}.mdx  ${d}  ${entry.parsed.title}`);
  }

  console.log(`\n✓ wrote ${byKey.size} posts to content/posts/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
