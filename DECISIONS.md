# Decisions

Architectural choices that are expensive to reverse. Add new entries at the top.

---

## D-012 · 2026-04-28 · `<Curtain />` is pure-CSS, mounted globally
The 1999 → 2026 transition between the retro homepage and the modern blog
is a pure-CSS keyframe animation in `globals.css` (`.curtain*`,
`@keyframes curtain-line/flash/cream`, `.modern-reveal`), driven by a
single global client component (`src/components/transition/Curtain.tsx`)
that listens for clicks on internal links and only fires when the
destination crosses the skin boundary (retro `/` ↔ modern `/blog|/posts|/tags|/categories|/archive`). No Framer Motion, no view-transition API
(yet), no JS animation loop. Reasons: (a) static export friendliness —
zero runtime animation graph cost, (b) `prefers-reduced-motion` is
honored declaratively (200ms cross-fade), (c) easy to tune. If we later
need imperative orchestration (audio cue, route preloading), the
component already owns the trigger gate; we'd swap the body for FM
without changing the public surface.

## D-011 · 2026-04-28 · Blog hard-locked to light (no theme toggle)
Per design direction "博客使用浅色系", the modern side now ships
exclusively in the Starbucks-inspired light palette. `ThemeBootstrap`
unconditionally sets `data-theme="light"` and clears any stale `dark`
key from localStorage; `ThemeToggle` is now a no-op export so any
existing imports compile, but the UI no longer surfaces it. The dark
prose variables in `globals.css` are kept (so `pre[data-theme="dark"]`
shiki blocks still render correctly under the light page), but they're
never the page-level scheme. Reverting would mean re-introducing the
toggle component body and removing the `localStorage.removeItem` line
in `ThemeBootstrap`.

## D-010 · 2026-04-28 · Retro homepage skin = dark CRT, not GeoCities teal
The retro homepage was originally classic-teal `#008080` GeoCities. It
is now black-on-phosphor CRT (`#050608` / `#33ff66` / `#ffb000`) with
2px scanlines, RGB chromatic-aberration overlay, soft phosphor vignette,
and a subtle flicker. Reference: haozi.me. Hard-rule #1 in `AGENTS.md`
("must feel like a 90s/early-2000s Chinese personal site, do not
modernize") is preserved — the kit (marquee / PHP warning / ActiveX
bar / 平平安安 couplets / canvas portrait / Mojibake / XSS leak / popup
ad / FrontPage badge) is intact, only re-skinned. Couplets stay
red-on-gold (the visual lure). `prefers-reduced-motion` kills all
animation loops while keeping the look.

## D-009 · 2026-04-28 · Modern side adopts Starbucks-inspired design system
The blog/content side adopts the visual language documented in
`DESIGN.md` (Starbucks flagship): warm-cream canvas `#f2f0eb`, white
cards with whisper-soft 2-layer shadow at 12px radius, full-pill 50px
buttons with `scale(0.95)` active, four-tier green system mapped to
roles — `#006241` (brand/H1), `#00754a` (CTA/links), `#1e3932`
(feature bands / footer / code blocks), `#2b5148` (decorative). Body
text at `rgba(0,0,0,0.87)` with `-0.01em` tracking. Inter from
`next/font/google` is the SoDoSans substitute (DESIGN.md §3 explicitly
sanctions Inter / Manrope / Nunito Sans as substitutes for the
proprietary SoDoSans). Gold (`#cba258`) is reserved for special
ceremony moments only — never a general accent. New utility classes
`.modern-card`, `.modern-pill`, `.modern-chip` carry the spec; legacy
`--bg/--fg/--muted/--rule/--accent` aliases are kept pointing at the
new palette so unrelated components compile without churn.

## D-008 · 2026-04-25 · Static search index over runtime backend
A JSON file at `/search-index.json` is generated at build time
(`scripts/build-search-index.mjs`, wired as `prebuild`). The client `Search`
component lazy-fetches it on first interaction and runs a small scoring pass
in the browser. No server, no API, no third-party search vendor. If the
corpus grows past ~500 posts, revisit (likely with minisearch/lunr).

## D-007 · 2026-04-25 · `force-static` on metadata routes
`robots.ts`, `sitemap.ts`, and `rss.xml/route.ts` all set
`export const dynamic = "force-static"`. Required by `output: "export"` in
Next 16 — without it the build fails when collecting page data.

## D-006 · 2026-04-25 · `useSyncExternalStore` for DOM-attribute and
##                       once-on-mount state
React 19's lint rule blocks `setState` in `useEffect` bodies. Both the
theme toggle (reads `<html data-theme>`) and the visitor counter (writes a
localStorage value once) now use `useSyncExternalStore`. The counter's
"increment once per session" is enforced by a module-scoped cache, not by
React state — `getSnapshot` is idempotent.

## D-005 · 2026-04-25 · Two-skin site (retro homepage / modern blog)
The site has two intentionally clashing visual languages. Homepage = retro
personal-site theatrics. Everything under `/blog`, `/tags`, `/categories`,
`/archive` = modern, sober, optimized for reading. Retro CSS lives in
`src/styles/retro.css` and is imported only by `app/page.tsx` (side-effect
import). The blog header/footer never appear on the retro page; the retro
chrome never appears on blog pages. No view-transition glue yet — kept as
a TODO for progressive enhancement.

## D-004 · 2026-04-25 · MDX via next-mdx-remote/rsc, not @next/mdx
Posts live outside `app/` (in `content/posts/`) so route-level MDX from
`@next/mdx` doesn't fit. `next-mdx-remote/rsc` lets us render server-side at
build time, keeps content separate from routing, and works under static export.

## D-003 · 2026-04-25 · Code highlighting via rehype-pretty-code + shiki
Built at build time, no runtime JS for syntax. Avoids client-side highlighter
weight. Theme: `github-light` + `github-dark-dimmed` with dual-theme CSS that
hides the wrong-theme block.

## D-002 · 2026-04-25 · Tailwind v4 CSS-first config
v4 ships with CSS-based theme config (`@theme` in `globals.css`) — no
`tailwind.config.js`. We follow that style. Typography plugin imported via
`@plugin "@tailwindcss/typography"` in CSS. Dark variant declared with
`@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`.

## D-001 · 2026-04-25 · Static export, no SSR
`next.config.ts` sets `output: 'export'`. Every route resolves to a static
HTML file. No runtime API routes; RSS and sitemap are emitted as static files.
Trade-off: no on-demand rendering, no preview mode. Acceptable for a personal
blog.
