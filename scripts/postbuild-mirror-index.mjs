#!/usr/bin/env node
/**
 * Post-build: mirror every `<name>.html` into `<name>/index.html` when the
 * sibling directory `<name>/` already exists in the export.
 *
 * Why this exists
 * ---------------
 * With `trailingSlash: false`, Next 16 emits the page as a flat
 * `out/blog/math-tricks.html` AND a sibling `out/blog/math-tricks/`
 * directory containing RSC payload `.txt` files. A dumb static server
 * (Python `http.server`, plain GitHub Pages, etc.) handles
 * `GET /blog/math-tricks` like this:
 *
 *   1. Try file `blog/math-tricks` -> not found.
 *   2. Try directory `blog/math-tricks/` -> exists -> 301 to
 *      `/blog/math-tricks/`.
 *   3. Serve `blog/math-tricks/index.html` -> not found -> 404 (or a
 *      directory listing of the RSC `.txt` files, which looks broken).
 *
 * Smart servers (`serve`, nginx with `try_files`, Cloudflare Pages,
 * Netlify, Vercel) prefer `<path>.html` first and skip the 301, so the
 * site already works there. This script makes the dumb-server case work
 * too -- the cost is one extra `index.html` per route, written exactly
 * once at build time.
 *
 * We do NOT delete the flat `<name>.html` files: smart servers still
 * prefer them, and Next's own routing assumes they exist.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

if (!fs.existsSync(OUT)) {
  console.error(`[postbuild] ${OUT} not found -- run \`next build\` first.`);
  process.exit(1);
}

let mirrored = 0;
let skipped = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".html")) continue;
    if (entry.name === "index.html") continue;
    if (entry.name === "404.html") continue;

    const base = entry.name.slice(0, -".html".length);
    const siblingDir = path.join(dir, base);
    if (
      !fs.existsSync(siblingDir) ||
      !fs.statSync(siblingDir).isDirectory()
    ) {
      skipped++;
      continue;
    }

    const dest = path.join(siblingDir, "index.html");
    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    fs.copyFileSync(full, dest);
    mirrored++;
  }
}

walk(OUT);
console.log(
  `[postbuild] mirrored ${mirrored} <name>.html -> <name>/index.html ` +
    `(skipped ${skipped} files with no sibling dir or already mirrored)`,
);
