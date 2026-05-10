/* eslint-disable @next/next/no-img-element --
 * The retro homepage deliberately uses raw <img> tags instead of next/image:
 *   1. The marquee `<img src="welcome.png">` is sized via CSS height + the
 *      cssmarquee animation; next/image's width/height contract + lazy
 *      loader breaks the auto-scrolling layout.
 *   2. The wechat QR + tongji pixel are decorative retro fixtures —
 *      forcing them through next/image violates the 90s/2000s aesthetic
 *      hard rule (CLAUDE.md, AGENTS.md hard rule #1).
 * Disabling per-file (not per-line) keeps the JSX scannable.
 */
import Link from "next/link";

import { getAllPosts } from "@/lib/posts";
import { formatDateShort } from "@/lib/format";
import { site } from "@/lib/site";

import { SlowCanvasPortrait } from "@/components/retro/SlowCanvasPortrait";
import { BgmToggle } from "@/components/retro/BgmToggle";
import { XssLine } from "@/components/retro/XssAlert";
import { Fireworks } from "@/components/retro/Fireworks";
import { RetroHtmlClass } from "@/components/retro/RetroHtmlClass";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: site.title,
  alternates: { canonical: "/" },
};

/**
 * Win98 multi-shadow halo applied to the 800px-wide table panels (the
 * old `.low-table` look). Defined once so nav + main share it verbatim.
 */
const PANEL_SHADOW =
  "[box-shadow:0_0_0_1px_#ccc,0_0_0_2px_#888,0_0_0_3px_#444,0_0_0_4px_#000]";

/** Win98 light panel cell border (used inside `<nav>` cells). */
const NAV_CELL = "table-cell border-2 border-[#808080] align-middle";

/** Anchor inside a nav cell — classic #0000ee blue + visited purple +
    haozi.me's wiggle-on-hover joke. */
const NAV_LINK =
  "block px-5 py-2.5 text-[#0000ee] underline text-sm visited:text-[#800080] hover:mr-[5px]";

/** Blue link styling reused inside the recent-posts panel. */
const BLOG_LINK = "text-[#0000ee] underline visited:text-[#800080]";

/** Background tile for the page shell — a tiny dark-blue starfield GIF
    restored from haozi.me. Kept inline (not in retro.css) because the
    user explicitly asked for the homepage CSS to be Tailwind-only. */
const PAGE_TILE_BG =
  'url("data:image/gif;base64,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")';

/**
 * Inline retro stylesheet — only the *unreachable-from-Tailwind* parts:
 *
 *   1. `.retro-root *` cursor cascade (utility classes can't blanket
 *      the whole subtree with a custom .cur arrow).
 *   2. `::-webkit-scrollbar*` pseudo-elements with baked-in Win98 SVG
 *      bevel + arrow glyphs (no Tailwind utility addresses pseudos).
 *   3. `@keyframes cssmarquee*` (referenced by `animate-[name_…]`
 *      utility shorthands on the marquee elements below).
 *   4. `.retro-portrait-done::before` finished-loading badge (pseudo
 *      elements aren't expressible via utilities).
 *
 * Everything else from the old `src/styles/retro.css` is now Tailwind
 * utilities on the JSX. The CSS file is gone.
 *
 * The `html.retro-active` class is added by `<RetroHtmlClass />` so the
 * scrollbar rules only fire on the retro homepage and never bleed into
 * `/blog`.
 */
const RETRO_INLINE_CSS = `
.retro-root, .retro-root * { cursor: url("/retro/default.cur"), default; }
.retro-root a, .retro-root a *,
.retro-root button, .retro-root button *,
.retro-root [role="button"], .retro-root [role="button"] * { cursor: pointer; }

html.retro-active, html.retro-active body { overflow-x: scroll; overflow-y: scroll; margin: 0; scrollbar-width: auto; scrollbar-color: #dfdfdf #c0c0c0; }
html.retro-active::-webkit-scrollbar, html.retro-active body::-webkit-scrollbar, .retro-root ::-webkit-scrollbar, .retro-root::-webkit-scrollbar { -webkit-appearance: none; appearance: none; width: 16px; }
html.retro-active::-webkit-scrollbar:horizontal, html.retro-active body::-webkit-scrollbar:horizontal, .retro-root ::-webkit-scrollbar:horizontal, .retro-root::-webkit-scrollbar:horizontal { height: 17px; }
html.retro-active::-webkit-scrollbar-corner, html.retro-active body::-webkit-scrollbar-corner, .retro-root::-webkit-scrollbar-corner { background: #dfdfdf; }
html.retro-active::-webkit-scrollbar-track, html.retro-active body::-webkit-scrollbar-track, .retro-root::-webkit-scrollbar-track { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='2' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 0H0v1h1v1h1V1H1V0z' fill='silver'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 0H1v1H0v1h1V1h1V0z' fill='%23fff'/%3E%3C/svg%3E"); }
html.retro-active::-webkit-scrollbar-thumb, html.retro-active body::-webkit-scrollbar-thumb, .retro-root::-webkit-scrollbar-thumb { -webkit-appearance: none; appearance: none; background-color: #dfdfdf; box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px gray, inset 2px 2px #dfdfdf; }
html.retro-active::-webkit-scrollbar-button:horizontal:end:increment, html.retro-active::-webkit-scrollbar-button:horizontal:start:decrement, html.retro-active::-webkit-scrollbar-button:vertical:end:increment, html.retro-active::-webkit-scrollbar-button:vertical:start:decrement, html.retro-active body::-webkit-scrollbar-button:horizontal:end:increment, html.retro-active body::-webkit-scrollbar-button:horizontal:start:decrement, html.retro-active body::-webkit-scrollbar-button:vertical:end:increment, html.retro-active body::-webkit-scrollbar-button:vertical:start:decrement, .retro-root::-webkit-scrollbar-button:horizontal:end:increment, .retro-root::-webkit-scrollbar-button:horizontal:start:decrement, .retro-root::-webkit-scrollbar-button:vertical:end:increment, .retro-root::-webkit-scrollbar-button:vertical:start:decrement { display: block; }
html.retro-active::-webkit-scrollbar-button:vertical:start, html.retro-active body::-webkit-scrollbar-button:vertical:start, .retro-root::-webkit-scrollbar-button:vertical:start { height: 17px; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 6H7v1H6v1H5v1H4v1h7V9h-1V8H9V7H8V6z' fill='%23000'/%3E%3C/svg%3E"); }
html.retro-active::-webkit-scrollbar-button:vertical:end, html.retro-active body::-webkit-scrollbar-button:vertical:end, .retro-root::-webkit-scrollbar-button:vertical:end { height: 17px; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E"); }
html.retro-active::-webkit-scrollbar-button:horizontal:start, html.retro-active body::-webkit-scrollbar-button:horizontal:start, .retro-root::-webkit-scrollbar-button:horizontal:start { width: 16px; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 4H8v1H7v1H6v1H5v1h1v1h1v1h1v1h1V4z' fill='%23000'/%3E%3C/svg%3E"); }
html.retro-active::-webkit-scrollbar-button:horizontal:end, html.retro-active body::-webkit-scrollbar-button:horizontal:end, .retro-root::-webkit-scrollbar-button:horizontal:end { width: 16px; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 4H6v7h1v-1h1V9h1V8h1V7H9V6H8V5H7V4z' fill='%23000'/%3E%3C/svg%3E"); }

@keyframes cssmarqueeWrapper { 0% { transform: translate(100%); } 100% { transform: translate(0); } }
@keyframes cssmarquee { 0% { transform: translate(0); } 100% { transform: translate(-100%); } }

.retro-portrait-done::before { position: absolute; top: 10px; left: 50%; transform: translateX(-250px); display: block; width: 14px; height: 16px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAIAAACp9tltAAAAOElEQVR4AWNoIBqAlP4nBA4cOMAABINK6UMDJSBCY2MqRaiGI3ymYppHqamE3TrUouAAEYCBJAAABoPtbxJ+BoUAAAAASUVORK5CYII="); background-repeat: no-repeat; background-size: cover; content: ""; pointer-events: none; }
`;

/**
 * Homepage — 1:1 port of haozi.me's late-90s/early-2000s Chinese
 * personal site. The DOM mirrors the original index.html almost
 * verbatim, with two deliberate additions:
 *
 *   1. A `::博客::` cell in the top nav so the modern blog is one
 *      click away.
 *   2. An "★ 最 新 日 志 ★" block at the bottom of the main panel
 *      surfacing the five most-recent MDX posts.
 *
 * Behaviours faithfully ported from haozi.me's Vite bundle:
 *
 *   - BGM autoplay-on-first-click + 2.5s default offset + localStorage
 *     resume → `<BgmToggle />`
 *   - 21-second slow-paint canvas portrait with the white-flash gag
 *     at the end → `<SlowCanvasPortrait />`
 *   - IntersectionObserver-driven "alert(/xss/)" Win98 modal triggered
 *     when the literal XSS line scrolls into view → `<XssLine />`
 *   - The eternal horizontal scrollbar joke via
 *     `min-w-[calc(100vw+5px)]` on the page shell — guaranteed to fire
 *     even before JS hydrates and under `prefers-reduced-motion`.
 *
 * **Styling — Tailwind only.** The retro skin used to live in
 * `src/styles/retro.css`. That file is gone. Every visual style is now
 * either a Tailwind utility on the JSX below or, for browser pseudo
 * elements that no utility can touch (custom scrollbars, the
 * portrait-finished badge, the cursor cascade, `@keyframes`), a single
 * inline `<style>` block whose contents are `RETRO_INLINE_CSS` above.
 *
 * Stays a Server Component so `getAllPosts()` (build-time filesystem
 * read) keeps working; the interactive bits are isolated client islands.
 */
export default function RetroHome() {
  const recent = getAllPosts().slice(0, 5);

  return (
    <div
      // `retro-root` survives so the inline-CSS scrollbar / cursor
      // selectors have something to hook onto. Everything else is
      // straight Tailwind utility.
      className={
        "retro-root relative pt-10 min-h-screen min-w-[calc(100vw+5px)] " +
        "bg-black bg-repeat bg-fixed text-xs text-[#e8e8e8] tracking-normal " +
        "max-[820px]:w-[calc(100vw+5px)]"
      }
      style={{
        fontFamily: '"Songti SC", "宋体", SimSun, serif',
        backgroundImage: PAGE_TILE_BG,
      }}
    >
      {/* ── Stamp `retro-active` on <html> so the macOS-overlay-defeating
            Win98 scrollbar rules apply. See RetroHtmlClass.tsx for the
            root-cause writeup of why `:has()` doesn't work here. ── */}
      <RetroHtmlClass />

      {/* The single inline retro stylesheet (replaces retro.css). */}
      <style dangerouslySetInnerHTML={{ __html: RETRO_INLINE_CSS }} />

      {/* ── Top marquee ─────────────────────────────────────── */}
      <div className="relative z-[1] overflow-hidden w-[calc(100vw+5px)] h-10 bg-white/60 text-2xl leading-10">
        <div className="absolute top-0 left-0 w-full h-full animate-[cssmarqueeWrapper_10s_linear_infinite] motion-reduce:[animation:none]">
          <p
            // inline-block + max-content prevents flex/abs-pos shrink
            // edge cases from clamping the text and producing visual
            // line-breaks in the CJK Extension B + replacement chars.
            className="absolute top-0 left-0 m-0 inline-block w-max min-w-max h-full pr-10 bg-[rgba(0,255,255,0.5)] text-white text-left whitespace-nowrap font-bold animate-[cssmarquee_10s_linear_infinite] motion-reduce:[animation:none]"
          >
            <img
              src="/retro/welcome.png"
              alt=""
              className="inline-block h-10 align-top mr-2"
            />
                    锘挎杩庡厜涓存垜鐨勪釜浜轰富椤�



          </p>
        </div>
      </div>

      {/* ── Top nav (low-table cells) ───────────────────────── */}
      <nav
        className={
          "relative z-[1] table mx-auto box-border w-[800px] h-10 " +
          "bg-[#c0c0c0] text-black " +
          PANEL_SHADOW +
          " max-[820px]:w-full"
        }
      >
        <div className={NAV_CELL}>
          <Link href="/" className={NAV_LINK}>::首页::</Link>
        </div>
        <div className={NAV_CELL}>
          <Link href="/blog" className={NAV_LINK}>::博客::</Link>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://github.com/haozi"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={NAV_LINK}
          >
            ::Github::
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://xss.haozi.me/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            ::XSS::
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://math.haozi.me/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            ::Math::
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://jsonuri.js.org/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            ::JSONURI::
          </a>
        </div>
      </nav>

      {/* ── Fake PHP warning ──────────────────────────────────
          Updated from haozi.me's `$tql / Luosifen.php` in-joke to
          a 2026 Chinese-tech-zeitgeist gag: 35岁 + 找不到工作 +
          996 三重叠加，保留同款 PHP-error 形态。 */}
      <span className="relative z-[1] text-[#808080] text-lg">
        PHP Fatal error: Class &apos;Job&apos; not found in
        /home/coder/35yo.php on line 996
        <br />
      </span>

      {/* ── Main content table ──────────────────────────────── */}
      <div
        className={
          "relative z-[1] table mx-auto box-border w-[800px] mt-10 " +
          "px-[30px] py-2.5 min-h-[300px] bg-[#0a0a1a] text-[#e8e8e8] " +
          PANEL_SHADOW +
          " max-[820px]:w-full"
        }
      >
        <p className="text-[#ff00ff] text-base leading-[1.6] my-2">
          &amp;nbsp;&amp;nbsp;大家好，我是耗子，来自杭州。�����锟斤拷烫烫烫
          <br />
          爱好旅行、撸狗、撸狗、撸狗
        </p>

        <hr className="h-10 border-0 my-3 bg-[url('/retro/fire.gif')] bg-repeat-x" />

        {/* slow-painted portrait, mimicking the original 56k-modem reveal */}
        <SlowCanvasPortrait />

        <figure className="my-3 mx-auto text-center">
          <img
            className="border-4 border-[#0000ff]"
            src="/retro/wechat.png"
            width={400}
            height={400}
            alt="我的微信"
          />
          <p className="w-[400px] max-w-full mx-auto mt-1.5 text-[#33ff66] text-lg text-center max-[820px]:w-auto">
            我的微信
          </p>
        </figure>

        {/* literal XSS string + Win98 modal triggered on scroll into view */}
        <XssLine />

        <hr className="h-10 border-0 my-3 bg-[url('/retro/fire.gif')] bg-repeat-x" />

        {/* ── ★ 最 新 日 志 ★ — blog content preserved here ── */}
        <section
          className="mt-2 text-base text-[#000080] bg-white border border-[#808080] px-[14px] py-2.5 max-[820px]:w-auto max-[820px]:max-w-full"
          aria-label="最新日志"
        >
          <p className="m-0 mb-1.5 text-lg text-[#800080] font-bold tracking-[4px]">
            ★ 最 新 日 志 ★
          </p>
          <ul className="[list-style:square_inside] pl-1.5 leading-[1.8] my-1.5">
            {recent.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className={BLOG_LINK}>
                  {p.frontmatter.title}
                </Link>
                <span className="text-[#808080] text-sm">
                  {" "}
                  — {formatDateShort(p.frontmatter.date)}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <Link href="/blog" className={BLOG_LINK}>» 进入博客</Link>
            &nbsp;&nbsp;
            <Link href="/archive" className={BLOG_LINK}>» 归档</Link>
            &nbsp;&nbsp;
            <Link href="/tags" className={BLOG_LINK}>» 标签</Link>
          </p>
        </section>
      </div>

      {/* ── Full-viewport fireworks overlay (Flash-era streak style) ── */}
      <Fireworks />

      {/* ── Baidu tongji pixel (kept as-is for nostalgia) ───── */}
      <p className="relative z-[1] text-center my-4">
        <a
          href="https://tongji.baidu.com/main/overview/1496713/overview/index?siteId=10256902"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/retro/tongji.png" alt="百度统计" />
        </a>
      </p>

      {/* ── 浏览器/分辨率建议（90s/2000s 个人主页标配的页脚声明） ──
          那个年代几乎每个个人主页底部都会挂这么一行：
            「本站最佳浏览器为 IE 6.0，分辨率 1024×768」
          严格对齐复古基调（hard rule #1）—— 不要现代 footer，不要
          dark mode tooltip，就一行小灰字居中。 */}
      {/* The "IE 6.0" punchline — surface text recommends upgrading to
          IE 6.0, but the icon + text link actually goes to Brave. The
          inline SVG is the classic IE6 lowercase blue `e` with yellow
          elliptical orbit — small enough to feel like a 16×16 favicon
          inside the line of small print. `align-text-bottom` keeps it
          baseline-aligned with the surrounding 12px text without nudging
          line-height. */}
      <p className="relative z-[1] text-center text-xs text-[#808080] mt-2 mb-4 leading-relaxed">
        本站最佳浏览器建议升级到{" "}
        <a
          href="https://brave.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0000ee] underline visited:text-[#800080] whitespace-nowrap"
        >
          {/* Canonical IE logo SVG sourced from Wikimedia Commons —
              `File:Internet_Explorer_4_and_5_logo.svg`, the same file
              Wikipedia's "Internet Explorer 6" article uses to represent
              the browser. Downloaded into `public/retro/ie6.svg` at
              build time so we don't hot-link Wikimedia in production
              (their hot-linking policy + offline reproducibility). */}
          <img
            src="/retro/ie6.svg"
            alt=""
            width="14"
            height="14"
            className="inline-block align-text-bottom mr-[3px]"
          />
          Internet Explorer 6.0
        </a>
        <br />
        并使用 1024 × 768 分辨率以获得最佳浏览体验
      </p>

      {/* ── BGM toggle (fixed bottom-left, Win98 button) ────── */}
      <BgmToggle />
    </div>
  );
}
