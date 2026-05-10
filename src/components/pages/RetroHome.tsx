/* eslint-disable @next/next/no-img-element --
 * Same rationale as the original homepage: the marquee, wechat QR and
 * tongji pixel must stay raw <img> for retro fidelity (CLAUDE.md hard
 * rule #1). Disabled per file to keep JSX scannable.
 */
import Link from "next/link";

import { getAllPosts } from "@/lib/posts";
import { formatDateShort } from "@/lib/format";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

import { SlowCanvasPortrait } from "@/components/retro/SlowCanvasPortrait";
import { BgmToggle } from "@/components/retro/BgmToggle";
import { XssLine } from "@/components/retro/XssAlert";
import { Fireworks } from "@/components/retro/Fireworks";
import { RetroLanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const PANEL_SHADOW =
  "[box-shadow:0_0_0_1px_#ccc,0_0_0_2px_#888,0_0_0_3px_#444,0_0_0_4px_#000]";

const NAV_CELL = "table-cell border-2 border-[#808080] align-middle";

const NAV_LINK =
  "block px-5 py-2.5 text-[#0000ee] underline text-sm visited:text-[#800080] hover:mr-[5px]";

const BLOG_LINK = "text-[#0000ee] underline visited:text-[#800080]";

const PAGE_TILE_BG =
  'url("data:image/gif;base64,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")';

const RETRO_INLINE_CSS = `.retro-root,.retro-root *{cursor:url(/retro/default.cur),default}.retro-root [role=button],.retro-root [role=button] *,.retro-root a,.retro-root a *,.retro-root button,.retro-root button *{cursor:pointer}html{overflow-x:scroll;overflow-y:scroll}body{margin:0}::-webkit-scrollbar{width:16px}::-webkit-scrollbar:horizontal{height:17px}::-webkit-scrollbar-corner{background:#dfdfdf}::-webkit-scrollbar-track{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2' fill='none'%3E%3Cpath fill='silver' fill-rule='evenodd' d='M1 0H0v1h1v1h1V1H1z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M2 0H1v1H0v1h1V1h1z' clip-rule='evenodd'/%3E%3C/svg%3E")}::-webkit-scrollbar-thumb{background-color:#dfdfdf;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #dfdfdf}::-webkit-scrollbar-button:horizontal:end:increment,::-webkit-scrollbar-button:horizontal:start:decrement,::-webkit-scrollbar-button:vertical:end:increment,::-webkit-scrollbar-button:vertical:start:decrement{display:block}::-webkit-scrollbar-button:vertical:start{height:17px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='17' fill='none'%3E%3Cpath fill='%23dfdfdf' fill-rule='evenodd' d='M15 0H0v16h1V1h14z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M2 1H1v14h1V2h12V1z' clip-rule='evenodd'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M16 17H0v-1h15V0h1z' clip-rule='evenodd'/%3E%3Cpath fill='gray' fill-rule='evenodd' d='M15 1h-1v14H1v1h14z' clip-rule='evenodd'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M8 6H7v1H6v1H5v1H4v1h7V9h-1V8H9V7H8z' clip-rule='evenodd'/%3E%3C/svg%3E")}::-webkit-scrollbar-button:vertical:end{height:17px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='17' fill='none'%3E%3Cpath fill='%23dfdfdf' fill-rule='evenodd' d='M15 0H0v16h1V1h14z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M2 1H1v14h1V2h12V1z' clip-rule='evenodd'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M16 17H0v-1h15V0h1z' clip-rule='evenodd'/%3E%3Cpath fill='gray' fill-rule='evenodd' d='M15 1h-1v14H1v1h14z' clip-rule='evenodd'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1z' clip-rule='evenodd'/%3E%3C/svg%3E")}::-webkit-scrollbar-button:horizontal:start{width:16px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='17' fill='none'%3E%3Cpath fill='%23dfdfdf' fill-rule='evenodd' d='M15 0H0v16h1V1h14z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M2 1H1v14h1V2h12V1z' clip-rule='evenodd'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M16 17H0v-1h15V0h1z' clip-rule='evenodd'/%3E%3Cpath fill='gray' fill-rule='evenodd' d='M15 1h-1v14H1v1h14z' clip-rule='evenodd'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M9 4H8v1H7v1H6v1H5v1h1v1h1v1h1v1h1z' clip-rule='evenodd'/%3E%3C/svg%3E")}::-webkit-scrollbar-button:horizontal:end{width:16px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='17' fill='none'%3E%3Cpath fill='%23dfdfdf' fill-rule='evenodd' d='M15 0H0v16h1V1h14z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M2 1H1v14h1V2h12V1z' clip-rule='evenodd'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M16 17H0v-1h15V0h1z' clip-rule='evenodd'/%3E%3Cpath fill='gray' fill-rule='evenodd' d='M15 1h-1v14H1v1h14z' clip-rule='evenodd'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M7 4H6v7h1v-1h1V9h1V8h1V7H9V6H8V5H7z' clip-rule='evenodd'/%3E%3C/svg%3E")}@keyframes cssmarqueeWrapper{0%{transform:translate(100%)}to{transform:translate(0)}}@keyframes cssmarquee{0%{transform:translate(0)}to{transform:translate(-100%)}}.retro-portrait-done:before{position:absolute;top:10px;left:50%;transform:translateX(-250px);display:block;width:14px;height:16px;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAIAAACp9tltAAAAOElEQVR4AWNoIBqAlP4nBA4cOMAABINK6UMDJSBCY2MqRaiGI3ymYppHqamE3TrUouAAEYCBJAAABoPtbxJ+BoUAAAAASUVORK5CYII=");background-repeat:no-repeat;background-size:cover;content:"";pointer-events:none}`;

/**
 * Locale-aware port of the haozi.me homepage. The retro DOM stays
 * pixel-for-pixel identical to the original — only the user-facing copy
 * (intro, nav labels, recent-posts heading, IE6 footer line) flows
 * through the dictionary, plus a small RetroLanguageSwitcher cell in
 * the top nav.
 */
export function RetroHome({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const recent = getAllPosts().slice(0, 5);

  return (
    <div
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
      <style dangerouslySetInnerHTML={{ __html: RETRO_INLINE_CSS }} />

      {/* ── Top marquee ─────────────────────────────────────── */}
      <div className="relative z-[1] overflow-hidden w-[calc(100vw+5px)] h-10 bg-white/60 text-2xl leading-10">
        <div className="absolute top-0 left-0 w-full h-full animate-[cssmarqueeWrapper_10s_linear_infinite] motion-reduce:[animation:none]">
          <p className="absolute top-0 left-0 m-0 inline-block w-max min-w-max h-full pr-10 bg-[rgba(0,255,255,0.5)] text-white text-left whitespace-nowrap font-bold animate-[cssmarquee_10s_linear_infinite] motion-reduce:[animation:none]">
            <img
              src="/retro/welcome.png"
              alt=""
              className="inline-block h-10 align-top mr-2"
            />
                    锘挎杩庡厜涓存垜鐨勪釜浜轰富椤�



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
          <Link href={localeHref(lang, "/")} className={NAV_LINK}>
            {d.retro.nav.home}
          </Link>
        </div>
        <div className={NAV_CELL}>
          <Link href={localeHref(lang, "/blog")} className={NAV_LINK}>
            {d.retro.nav.blog}
          </Link>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://github.com/haozi"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={NAV_LINK}
          >
            {d.retro.nav.github}
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://xss.haozi.me/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            {d.retro.nav.xss}
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://math.haozi.me/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            {d.retro.nav.math}
          </a>
        </div>
        <div className={NAV_CELL}>
          <a
            href="https://jsonuri.js.org/"
            target="_blank"
            rel="noreferrer"
            className={NAV_LINK}
          >
            {d.retro.nav.jsonuri}
          </a>
        </div>
      </nav>

      {/* ── Fake PHP warning + tiny language switcher inline ── */}
      <span className="relative z-[1] text-[#808080] text-lg flex items-center gap-3 flex-wrap">
        <span>
          {d.retro.php_warning}
        </span>
        <RetroLanguageSwitcher current={lang} />
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
          {d.retro.intro}
          <br />
          {d.retro.intro_line2}
        </p>

        <hr className="h-10 border-0 my-3 bg-[url('/retro/fire.gif')] bg-repeat-x" />

        <SlowCanvasPortrait />

        <figure className="my-3 mx-auto text-center">
          <img
            className="border-4 border-[#0000ff]"
            src="/retro/wechat.png"
            width={400}
            height={400}
            alt={d.retro.wechat}
          />
          <p className="w-[400px] max-w-full mx-auto mt-1.5 text-[#33ff66] text-lg text-center max-[820px]:w-auto">
            {d.retro.wechat}
          </p>
        </figure>

        <XssLine />

        <hr className="h-10 border-0 my-3 bg-[url('/retro/fire.gif')] bg-repeat-x" />

        <section
          className="mt-2 text-base text-[#000080] bg-white border border-[#808080] px-[14px] py-2.5 max-[820px]:w-auto max-[820px]:max-w-full"
          aria-label={d.retro.recent_title}
        >
          <p className="m-0 mb-1.5 text-lg text-[#800080] font-bold tracking-[4px]">
            {d.retro.recent_title}
          </p>
          <ul className="[list-style:square_inside] pl-1.5 leading-[1.8] my-1.5">
            {recent.map((p) => (
              <li key={p.slug}>
                <Link
                  href={localeHref(lang, `/blog/${p.slug}`)}
                  className={BLOG_LINK}
                >
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
            <Link href={localeHref(lang, "/blog")} className={BLOG_LINK}>
              {d.retro.enter_blog}
            </Link>
            &nbsp;&nbsp;
            <Link href={localeHref(lang, "/archive")} className={BLOG_LINK}>
              {d.retro.archive}
            </Link>
            &nbsp;&nbsp;
            <Link href={localeHref(lang, "/tags")} className={BLOG_LINK}>
              {d.retro.tags}
            </Link>
          </p>
        </section>
      </div>

      <Fireworks />

      <p className="relative z-[1] text-center my-4">
        <a
          href="https://tongji.baidu.com/main/overview/1496713/overview/index?siteId=10256902"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/retro/tongji.png" alt="百度统计" />
        </a>
      </p>

      <p className="relative z-[1] text-center text-xs text-[#808080] mt-2 mb-4 leading-relaxed">
        {d.retro.browser_advice}{" "}
        <a
          href="https://brave.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0000ee] underline visited:text-[#800080] whitespace-nowrap"
        >
          <img
            src="/retro/ie6.svg"
            alt=""
            width="14"
            height="14"
            className="inline-block align-text-bottom mr-[3px]"
          />
          {d.retro.browser_advice_after}
        </a>
        <br />
        {d.retro.resolution_advice}
      </p>

      <BgmToggle />
    </div>
  );
}
