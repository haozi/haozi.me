"use client";

import { useEffect } from "react";
import { type Locale, intlLocale } from "@/lib/i18n";

/**
 * Keeps `<html lang>` in sync with the active locale on the client.
 *
 * Why this exists
 * ---------------
 * The site uses a single shared root layout (`src/app/layout.tsx`) so that
 * Next.js can perform soft RSC navigation between locales (`/blog` ↔
 * `/zh-Hans/blog`). With multi-root layouts (one `<html>` per locale)
 * Next.js forces a hard reload on every cross-root navigation — that's
 * the framework contract, not a bug. Collapsing to one root is the only
 * way to get AJAX-style locale switching.
 *
 * The trade-off: the shared root has a single static `<html lang="en">`
 * value at build time, which would lie on `/zh-Hans/...` pages. This
 * component patches that on the client by writing `intlLocale[lang]` to
 * `documentElement.lang` after mount and after every locale change.
 *
 * SEO note: search engines that don't run JS will read the static `en`
 * value, which is fine because:
 *   1. The per-locale `<head>` still emits proper `<link rel="alternate"
 *      hreflang>` via Next metadata, which is the canonical hreflang
 *      signal.
 *   2. Modern crawlers (Googlebot, Bingbot) execute JS and pick up the
 *      patched value.
 */
export function HtmlLangSync({ lang }: { lang: Locale }) {
  useEffect(() => {
    try {
      document.documentElement.lang = intlLocale[lang];
    } catch {
      /* ignore — non-DOM env, etc. */
    }
  }, [lang]);
  return null;
}
