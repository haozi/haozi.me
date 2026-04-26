<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agents Guide — haozi-me

This project is built and maintained by AI agents alongside the human owner.
Read `CLAUDE.md` for project intent. Read `DECISIONS.md` for hard constraints.
Append to `WORKLOG.md` after each meaningful change.

## Hard rules
1. The homepage **must** feel like a 90s/early-2000s Chinese personal site.
   Do not "modernize" it into a SaaS landing page.
2. Blog reading pages **must** be modern, calm, optimized for long-form text.
   Do not bleed retro effects into article bodies.
3. SSG only. `next.config.ts` has `output: 'export'`. Do not introduce
   features that break static export (server actions, dynamic route handlers,
   ISR, default `next/image` loader, cookies, etc.).
4. Posts are MDX in `content/posts/`. Don't move them.
5. No CMS / no DB / no paid services without an entry in `DECISIONS.md` and
   explicit user approval.

## Soft rules
- Retro components are self-contained under `src/components/retro/`.
- Blog components are dependency-light, under `src/components/blog/`.
- When in doubt, drop a line in `TODO.md` and keep moving.
