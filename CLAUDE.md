@AGENTS.md

# haozi-me — Project Intent

## Two-skin site
- **Homepage (`/`)** — over-the-top late-90s / early-2000s Chinese personal
  site. Marquee, fake PHP warning, fake ActiveX install bar, popup ad,
  table layout double borders, slowly-canvas-drawn portrait, broken
  horizontal scrollbar, NBSP space hacks, 锟斤拷 garbled text, 平平安安
  couplet figures, bouncing/blinking title, MIDI-style toggleable BG
  audio. **Loud, but not unusable.**
- **Blog & content (`/blog`, `/posts/[slug]`, `/tags`, `/categories`,
  `/archive`)** — modern, clean, calm. High-quality long-form reading.
- A deliberate transition (`<Curtain />` style) between the two on first
  click.

## Stack
- Next.js 16 (App Router) — read `node_modules/next/dist/docs/` first.
- React 19, TypeScript, Tailwind v4 (CSS-first config).
- `next-mdx-remote/rsc` for MDX (content lives outside `app/`).
- gray-matter / remark-gfm / rehype-slug / rehype-autolink-headings /
  rehype-pretty-code+shiki.
- `feed` for RSS.
- `output: 'export'` — static export only.

## Layout
```
src/
  app/                        routes (App Router)
    page.tsx                  retro homepage
    blog/page.tsx             modern blog index
    posts/[slug]/page.tsx     article
    tags/, categories/, archive/
    sitemap.ts                next sitemap
    rss.xml/route.ts          static RSS via Route Handler
  components/
    retro/                    marquee, popups, fake warnings, etc.
    blog/                     post card, TOC, prev/next, code block
  lib/                        content loaders, helpers, site config
  styles/                     CSS partials
content/
  posts/                      *.mdx — source of truth
public/retro/                 pixel/gif assets
public/audio/                 optional MIDI-style audio
scripts/                      build-time helpers (search index)
```

## Conventions
- Posts: `content/posts/<slug>.mdx`. Frontmatter contract is in
  `src/lib/posts.ts` (`PostFrontmatter` type).
- Slug = filename. No nested folders for now.
- Default working dir: `/home/morpheus/Workspace/haozi-me`.

## Logs
- `WORKLOG.md` — what got done, per phase.
- `TODO.md` — small parked items.
- `DECISIONS.md` — load-bearing choices.
