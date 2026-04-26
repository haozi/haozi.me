import Link from "next/link";
import "@/styles/retro.css";

import { getAllPosts } from "@/lib/posts";
import { formatDateShort } from "@/lib/format";
import { site } from "@/lib/site";

import { SlowCanvasPortrait } from "@/components/retro/SlowCanvasPortrait";
import { BgmToggle } from "@/components/retro/BgmToggle";
import { XssLine } from "@/components/retro/XssAlert";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: site.title,
  alternates: { canonical: "/" },
};

/**
 * Homepage — 1:1 port of haozi.me's late-90s/early-2000s Chinese
 * personal site. The DOM mirrors the original index.html almost
 * verbatim, with two deliberate additions:
 *
 *   1. A `::博客::` cell in the top nav so the modern blog is one
 *      click away.
 *   2. An "★ 最 新 日 志 ★" block at the bottom of `.i-main`
 *      surfacing the five most-recent MDX posts.
 *
 * Behaviours faithfully ported from haozi.me's Vite bundle
 * (`index.b26d234e.js`):
 *
 *   - BGM autoplay-on-first-click + 2.5s default offset + localStorage
 *     resume → `<BgmToggle />`
 *   - 21-second slow-paint canvas portrait with the white-flash gag
 *     at the end → `<SlowCanvasPortrait />`
 *   - IntersectionObserver-driven "alert(/xss/)" Win98 modal triggered
 *     when the `<p class="i-xss">` line scrolls into view → `<XssLine />`
 *   - The eternal horizontal scrollbar joke via `width: calc(100vw + 5px)`
 *     on `.i-home` and `.cssmarquee` (see `src/styles/retro.css`)
 *
 * Stays a Server Component so `getAllPosts()` (build-time filesystem
 * read) keeps working; the interactive bits are isolated client islands.
 */
export default function RetroHome() {
  const recent = getAllPosts().slice(0, 5);

  return (
    <div className="retro-root i-home">
      {/* ── Top marquee ─────────────────────────────────────── */}
      <div className="cssmarquee">
        <div className="cssmarquee-wrapper">
          <p className="cssmarquee-words">
            <img src="/retro/welcome.png" alt="" />
            欢迎光临我的个人主页
          </p>
        </div>
      </div>

      {/* ── Top nav (low-table cells) ───────────────────────── */}
      <nav className="i-nav low-table">
        <div className="low-cell">
          <Link href="/">::首页::</Link>
        </div>
        <div className="low-cell">
          <Link href="/blog">::博客::</Link>
        </div>
        <div className="low-cell">
          <a
            href="https://github.com/haozi"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            ::Github::
          </a>
        </div>
        <div className="low-cell">
          <a href="https://xss.haozi.me/" target="_blank" rel="noreferrer">
            ::XSS::
          </a>
        </div>
        <div className="low-cell">
          <a href="https://math.haozi.me/" target="_blank" rel="noreferrer">
            ::Math::
          </a>
        </div>
        <div className="low-cell">
          <a href="https://jsonuri.js.org/" target="_blank" rel="noreferrer">
            ::JSONURI::
          </a>
        </div>
      </nav>

      {/* ── Fake PHP warning ────────────────────────────────── */}
      <span className="gray">
        PHP Warning: Undefined variable $tql in
        /workspace/heat/teams/haozi/Luosifen.php:233
        <br />
      </span>

      {/* ── Main content table ──────────────────────────────── */}
      <div className="i-main low-table">
        <p className="pink">
          &nbsp;&nbsp;大家好，我是耗子，来自杭州。
          <br />
          爱好旅行、撸狗、撸狗、撸狗
        </p>

        <hr className="fire" />

        {/* slow-painted portrait, mimicking the original 56k-modem reveal */}
        <SlowCanvasPortrait />

        <figure className="i-wechat">
          <img
            className="low-img"
            src="/retro/wechat.png"
            width={400}
            height={400}
            alt="我的微信"
          />
          <p>我的微信</p>
        </figure>

        {/* literal XSS string + Win98 modal triggered on scroll into view */}
        <XssLine />

        <hr className="fire" />

        {/* ── ★ 最 新 日 志 ★ — blog content preserved here ── */}
        <section className="i-blog" aria-label="最新日志">
          <p className="i-blog-title">★ 最 新 日 志 ★</p>
          <ul className="i-blog-list">
            {recent.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>{p.frontmatter.title}</Link>
                <span className="i-blog-date">
                  {" "}
                  — {formatDateShort(p.frontmatter.date)}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <Link href="/blog">» 进入博客</Link>
            &nbsp;&nbsp;
            <Link href="/archive">» 归档</Link>
            &nbsp;&nbsp;
            <Link href="/tags">» 标签</Link>
          </p>
        </section>
      </div>

      {/* ── Baidu tongji pixel (kept as-is for nostalgia) ───── */}
      <p className="i-tongji">
        <a
          href="https://tongji.baidu.com/main/overview/1496713/overview/index?siteId=10256902"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/retro/tongji.png" alt="百度统计" />
        </a>
      </p>

      {/* ── BGM toggle (fixed bottom-left, Win98 button) ────── */}
      <BgmToggle />
    </div>
  );
}
