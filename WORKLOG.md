# Worklog

## 2026-04-25 — Phase 1: bootstrap
- Created project with `create-next-app` (Next 16, React 19, TS, Tailwind v4, ESLint, App Router, src dir).
- Installed blog deps: gray-matter, next-mdx-remote, remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code, shiki, reading-time, feed, github-slugger.
- Installed dev deps: prettier, prettier-plugin-tailwindcss, @tailwindcss/typography.
- Created directory skeleton: `src/components/{retro,blog}`, `src/lib`, `src/styles`, `content/posts`, `scripts`, `public/{retro,audio}`.
- Wrote AGENTS.md, CLAUDE.md, WORKLOG.md, TODO.md, DECISIONS.md.
- `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`.

## 2026-04-25 — Phase 2: blog core
- `src/lib/posts.ts`: filesystem → typed `Post[]`; tag/category/archive groupings; prev/next adjacency; cached.
- `src/lib/toc.ts`: cheap heading extractor → `TocItem[]` with github-slugger ids.
- `src/lib/mdx-options.ts`: shared remark/rehype config (gfm, slug, autolink-wrap, pretty-code dual theme).
- `src/lib/format.ts`: zh-CN long + short date formatters.
- `src/components/blog/PostBody.tsx` (RSC) renders MDX via `next-mdx-remote/rsc`.
- `src/components/blog/MdxComponents.tsx`: `<a>` routed through `next/link` for internal hrefs; `<pre>` opts out of `prose`.
- Routes:
  - `/blog` (list with static `<Search />`)
  - `/blog/[slug]` (TOC sidebar, prev/next, JSON-LD article)
  - `/tags`, `/tags/[tag]`
  - `/categories`, `/categories/[category]`
  - `/archive` (year-grouped timeline)
  - `/rss.xml/route.ts` (`force-static`)
  - `/sitemap.ts`, `/robots.ts` (both `force-static`)
  - `/not-found.tsx`
- `scripts/build-search-index.mjs` writes `public/search-index.json`; wired as `prebuild`.
- `Search` component: lazy-fetched static index with light scoring.
- 5 example MDX posts: hello-world, why-static, jsonuri, xss-fun, math-tricks.

## 2026-04-25 — Phase 3: retro homepage
- `src/styles/retro.css`: scoped to `.retro-root`, never imported globally.
- Retro components (all under `src/components/retro/`):
  - Marquee, PhpWarning, ActiveXBar, PopupAd, FlashFrame, SlowCanvasPortrait,
    Couplets, BlinkingTitle (with crash-favicon on tab blur), VisitorCounter
    (localStorage), BgmToggle (no autoplay), Mojibake (锟斤拷), XssLeak.
- `src/app/page.tsx` composed as a `<table>`-layout pastiche with double borders,
  pipe-separated nav, ridge-frame banner, ★ NEW! ★, ridge frames, footer badges,
  popup ad. Side-effect imports `retro.css`.
- Mobile: couplets hidden on small screens, popup shrunk; horizontal-scroll
  haunt clamps to 100% on narrow viewports so we don't punish phones.

## 2026-04-25 — Phase 4: reading experience polish
- Tailwind typography plugin enabled via `@plugin "@tailwindcss/typography"`.
- `prose` styles tuned via CSS vars to flip with `[data-theme="dark"]`.
- Inline `ThemeBootstrap` script on `<html>` sets data-theme before paint —
  no FOUC; respects `prefers-color-scheme`; persists via localStorage.
- `ThemeToggle` rewritten with `useSyncExternalStore` so it tracks the DOM
  attribute without setState-in-effect.
- Code blocks: rehype-pretty-code dual-theme; the wrong theme is hidden via
  CSS attribute selectors so we ship one HTML and switch with one attribute.
- Sticky right-rail TOC on `lg+`, with `IntersectionObserver`-driven active
  highlighting; falls back to inline on mobile.
- prev/next post nav as two-card grid at the bottom of every article.

## 2026-04-25 — Phase 5: validation
- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (after fixing setState-in-effect in ThemeToggle and
  VisitorCounter; tightened BgmToggle ref cleanup).
- `npm run build` — succeeded; 31 routes prerendered; `out/` contains
  `index.html` (retro), `blog/<slug>/index.html`, `tags/<tag>/index.html`,
  `categories/<category>/index.html`, `archive/index.html`, `robots.txt`,
  `rss.xml`, `sitemap.xml`, `search-index.json`.
- README replaced with real project docs.

### Open follow-ups (see TODO.md)
- Hook up real BGM file under `public/audio/bgm.mp3` (component is wired and
  silent until the file exists).
- Replace placeholder retro images under `public/retro/`.
- Per-post OG image generation (deferred; needs a generator).

## 2026-04-28 — Phase 6: two-skin redesign + 1999 → 2026 transition

The site is now visually two-skinned, with a deliberate transition between
them on first crossing. Direction came from `DESIGN.md` (Starbucks-inspired
light system) for the modern side; the retro homepage moved from the
classic teal/yellow GeoCities palette into a dark CRT/terminal look
(reference: haozi.me).

### Retro skin (`/`) — dark CRT
- `src/styles/retro.css` rewritten:
  - Background → near-black `#050608` with CRT scanlines (2px stripe
    repeating gradient), soft phosphor vignette, RGB chromatic-aberration
    overlay, slow flicker + scan animations.
  - Text → phosphor green `#33ff66` and amber `#ffb000` as the dual primary
    colors; muted `#7fbf95`; visited links `#c388ff`; hover amber.
  - Frames now have `2px ridge #2a2a2a` outer + `2px double #33ff66` inner
    with inset green glow.
  - Marquee is a solid black bar with phosphor-green text + soft glow.
  - HR is a chromatic horizontal beam (green-amber-pink-cyan) with green
    drop-shadow.
  - All popup, ActiveX, PHP-warning, and XSS-leak chrome moved to dark
    panels with amber-on-dark text.
  - Couplets kept red/gold (the visual lure) but with extra amber halo so
    they pop against black.
  - `prefers-reduced-motion` kills all animation loops while keeping the
    look intact.
- `src/app/page.tsx` keeps every retro component (marquee / PhpWarning /
  ActiveXBar / Couplets / canvas portrait / FlashFrame / Mojibake / XssLeak
  / VisitorCounter / BgmToggle / PopupAd) but every inline color was
  rewritten to the dark palette: `#0a0d10` panels, `#33ff66` headings,
  `#ffb000` accents, `#c8ffd1` body. Footer badges flipped to black with
  phosphor / amber / hot-pink borders + glow.

### Modern skin (blog & content) — Starbucks light
- `src/app/globals.css` rewritten end-to-end:
  - Added the four-tier green system: `--color-brand-green` `#006241`,
    `--color-accent-green` `#00754a`, `--color-house-green` `#1e3932`,
    `--color-uplift-green` `#2b5148`, plus `--color-light-green`,
    `--color-gold`, `--color-gold-lightest`.
  - Page canvas locked to Neutral Warm `#f2f0eb`; cards `#ffffff`.
  - Text tokens: `--color-text` `rgba(0,0,0,0.87)`, `--color-text-soft`
    `rgba(0,0,0,0.58)`, `--color-text-on-dark*`.
  - Tracking token `--tracking-tight: -0.01em` applied to body globally
    (matches SoDoSans's signature compressed feel).
  - Radius / shadow tokens: `--radius-card: 12px`, `--radius-pill: 50px`,
    `--shadow-card` (Starbucks whisper double), `--shadow-card-hover`,
    `--shadow-nav` (three-layer soft lift).
  - Kept legacy `--bg/--fg/--muted/--rule/--accent` aliases pointing at
    the new palette so existing components didn't break.
  - Added primitive utility classes: `.modern-card`, `.modern-pill`
    (`--filled` / `--outline` / `--ink`), `.modern-chip`. All buttons are
    50px full pills with `scale(0.95)` active.
  - `prose` re-themed: headings in Starbucks Green, links Green Accent
    with 3px underline-offset, blockquote with Green-Accent left border on
    Gold-Lightest cream, inline `code` in Light Green / House Green text,
    `pre` blocks in House Green `#1e3932`.
  - Added `.modern-reveal` page-entry animation
    (`translateY 16px → 0` + blur clear, 700ms cubic-bezier(0.16,1,0.3,1),
    250ms delay).
- `src/app/layout.tsx`: switched font to `next/font/google` Inter as the
  SoDoSans substitute (per DESIGN.md §3 substitute guidance), exposed via
  `--font-inter`. Mounted `<Curtain />` globally.
- `src/components/blog/SiteHeader.tsx`: sticky cream-canvas top bar with
  whisper-soft three-layer shadow; left = Starbucks-Green wordmark;
  center = Blog/Archive/Tags/Categories nav (hover tints to Green Accent);
  right = outline-green RSS pill + filled-green "← 1999" pill that hops
  back to the retro homepage (triggers reverse curtain).
- `src/components/blog/SiteFooter.tsx`: full-width House-Green
  (`#1e3932`) band — espresso bookend. White headline + 70%-white body,
  outlined-white "回到 1999" pill + white-fill "RSS" pill, three nav
  columns.
- `src/components/blog/PostCard.tsx`: white card, 12px radius,
  whisper-soft 2-layer shadow, 24px padding; title in Starbucks Green
  weight 600 with `-0.012em`; reveals "Read →" Green-Accent text on
  hover; tags rendered as outline-Green-Accent 50px chips along a
  hairline-separated bottom row.
- `src/components/blog/PostMeta.tsx`: rebuilt as a flex row of
  date · reading-time · category · 50px tag chips, all at 13px in
  Text Soft.
- `src/components/blog/PostNav.tsx`: prev/next as two `.modern-card`
  panels, with green-accent overline ("← Previous" / "Next →") and
  Starbucks-Green title.
- `src/components/blog/Toc.tsx`: header in 12px green uppercase + 0.12em;
  hairline left rail; active item = 2px Green-Accent left border + Green-
  Accent text + weight 600.
- `src/components/blog/ThemeBootstrap.tsx`: simplified — now hard-locks
  `data-theme="light"` and clears any stale `dark` localStorage key.
  Per user direction: "博客使用浅色系".
- `src/components/blog/ThemeToggle.tsx`: turned into a no-op so existing
  imports keep compiling.
- Pages updated to the new visual language with shared scaffolding
  (cream canvas, max-w-[1100px] / max-w-[860px] containers, accent green
  uppercase eyebrow + Starbucks-Green H1, Inter font):
  - `src/app/blog/page.tsx` — hero + featured-post split card (cream side
    / House-Green quote side with gold quotes) + 2-column post grid +
    "Archive →" link in the section header.
  - `src/app/blog/[slug]/page.tsx` — modernized header with eyebrow back-
    link, large Starbucks-Green title, optional 18px lead description,
    prose body, prev/next, sticky TOC.
  - `src/app/archive/page.tsx` — year sections with hairline-rail
    timelines.
  - `src/app/tags/page.tsx` + `src/app/tags/[tag]/page.tsx` — tags page
    as 50px chip grid; per-tag page as PostCard grid with breadcrumb.
  - `src/app/categories/page.tsx` + `src/app/categories/[category]/page.tsx`
    — categories as 2-up modern-card list; per-category page as PostCard
    grid with breadcrumb.
  - `src/app/not-found.tsx` — modern 404: cream canvas, eyebrow "404 ·
    Not Found", green-accent + outline pill duo back to home / blog.
- `src/app/blog/layout.tsx`, `src/app/archive/layout.tsx`,
  `src/app/tags/layout.tsx`, `src/app/categories/layout.tsx`: all share
  the same wrapper — `data-skin="modern"`, cream canvas, SiteHeader,
  `.modern-reveal` main, SiteFooter.

### Transition (`<Curtain />`)
- New `src/components/transition/Curtain.tsx` (client component) is
  mounted globally in the root layout. It listens for clicks on
  internal `<a>` elements and only fires when the destination crosses
  the skin boundary:
  - Retro `/` → modern (`/blog`, `/posts`, `/tags`, `/categories`,
    `/archive`): plays the "1999 → 2026" sequence.
  - Modern → retro (`/`): plays the same sequence in reverse spirit
    ("shutting down to 1999").
- The animation (~1.1s) is pure CSS keyframes for static-export
  friendliness:
  1. **0–200ms** `curtain-line`: a 1px phosphor-green hairline erupts
     across the viewport (scaleX 0 → 1).
  2. **200–350ms** the line stretches vertically into a green flash
     (scaleY 1 → 80) — the classic CRT "switching on" gesture.
  3. **350–600ms** `curtain-flash`: a green radial bloom fades while
     `curtain-cream` cross-fades the canvas from black `#000` to
     Neutral Warm `#f2f0eb`.
  4. **600–1100ms** the curtain fades out and the modern page's
     `.modern-reveal` animation runs (`translateY(16px) blur(6px) → 0`).
- Modifier-key clicks (`cmd-click` / `ctrl-click`) and `target="_blank"`
  links bypass the curtain.
- `prefers-reduced-motion` collapses everything to a 200ms cross-fade.

### Files touched
- `src/app/globals.css` — rewritten
- `src/styles/retro.css` — rewritten (dark CRT)
- `src/app/layout.tsx` — Inter font, mounted `<Curtain />`
- `src/app/page.tsx` — every inline color flipped to dark CRT palette
- `src/components/transition/Curtain.tsx` — new
- `src/components/blog/SiteHeader.tsx` — rewritten
- `src/components/blog/SiteFooter.tsx` — rewritten
- `src/components/blog/PostCard.tsx` — rewritten
- `src/components/blog/PostMeta.tsx` — rewritten
- `src/components/blog/PostNav.tsx` — rewritten
- `src/components/blog/Toc.tsx` — rewritten
- `src/components/blog/ThemeBootstrap.tsx` — locked to light
- `src/components/blog/ThemeToggle.tsx` — no-op
- `src/app/blog/layout.tsx`, `src/app/archive/layout.tsx`,
  `src/app/tags/layout.tsx`, `src/app/categories/layout.tsx` — unified
  modern wrapper
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`,
  `src/app/archive/page.tsx`, `src/app/tags/page.tsx`,
  `src/app/tags/[tag]/page.tsx`, `src/app/categories/page.tsx`,
  `src/app/categories/[category]/page.tsx`, `src/app/not-found.tsx` —
  modernized to the new design system

### Validation pending
- `npx tsc --noEmit` and `npm run build` — to be run after this commit.
- Visual QA on iPad / mobile (the retro 1px-wider haunt clamps to 100%
  under 720px so the dark CRT background should sit cleanly on phones).
