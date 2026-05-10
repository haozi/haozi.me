/**
 * i18n core — locale list, type narrowing, URL helpers.
 *
 * Architecture (per CLAUDE.md hard rule #3 — SSG only):
 *   - Three locales: en (default, no prefix), zh-Hans, zh-Hant.
 *   - Default locale lives at the URL root (`/`, `/blog/`, ...).
 *     Non-default locales live at a subpath prefix (`/zh-Hans/blog/`,
 *     `/zh-Hant/blog/`).
 *   - Routing is realized via the multi-root layout pattern:
 *       src/app/(en)/...      → English routes (no URL impact, route group)
 *       src/app/zh-Hans/...   → /zh-Hans/...
 *       src/app/zh-Hant/...   → /zh-Hant/...
 *     Each top-level group/folder ships its own root layout with the
 *     correct `<html lang>` attribute baked at build time.
 *   - Auto-detection is purely client-side (LocaleAutoDetect.tsx) since
 *     `output: 'export'` rules out middleware/redirects.
 *
 * This module is plain TS (no React imports) so it can be consumed from
 * Server Components, Client Components, route handlers, sitemap, RSS,
 * and the build-time search index script.
 */

import { siteCore } from "./site";

export const locales = ["en", "zh-Hans", "zh-Hant"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Friendly endonym shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
};

/** Short label for compact switcher cells. */
export const localeShortLabels: Record<Locale, string> = {
  en: "EN",
  "zh-Hans": "简",
  "zh-Hant": "繁",
};

/** OpenGraph locale tag (BCP 47 → OG style underscore). */
export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  "zh-Hans": "zh_CN",
  "zh-Hant": "zh_TW",
};

/** `Intl` BCP 47 tag used for date/number formatting per locale. */
export const intlLocale: Record<Locale, string> = {
  en: "en-US",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
};

/** Type guard. */
export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (locales as readonly string[]).includes(x);
}

/** URL prefix for a locale (`""` for default, `/zh-Hans` for others). */
export function localePrefix(lang: Locale): string {
  return lang === defaultLocale ? "" : `/${lang}`;
}

/**
 * Build a fully-qualified internal href for a given locale.
 *
 *   localeHref("en",      "/blog")     → "/blog"
 *   localeHref("zh-Hans", "/blog")     → "/zh-Hans/blog"
 *   localeHref("zh-Hant", "/blog/foo") → "/zh-Hant/blog/foo"
 *   localeHref("en",      "/")         → "/"
 *
 * `path` MUST start with `/`. The function is locale-prefix-idempotent:
 * calling it on an already-prefixed path is a programming error.
 */
export function localeHref(lang: Locale, path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`[i18n] localeHref: path must start with '/' (got ${path})`);
  }
  if (path === "/") return localePrefix(lang) || "/";
  return localePrefix(lang) + path;
}

/**
 * Decompose a pathname into its locale + locale-stripped suffix.
 *
 *   parsePath("/")                  → { lang: "en",      rest: "/" }
 *   parsePath("/blog/foo")          → { lang: "en",      rest: "/blog/foo" }
 *   parsePath("/zh-Hans")           → { lang: "zh-Hans", rest: "/" }
 *   parsePath("/zh-Hans/")          → { lang: "zh-Hans", rest: "/" }
 *   parsePath("/zh-Hans/blog/foo")  → { lang: "zh-Hans", rest: "/blog/foo" }
 */
export function parsePath(pathname: string): { lang: Locale; rest: string } {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  for (const l of locales) {
    if (l === defaultLocale) continue;
    if (normalized === `/${l}`) return { lang: l, rest: "/" };
    if (normalized.startsWith(`/${l}/`)) {
      return { lang: l, rest: normalized.slice(l.length + 1) };
    }
  }
  return { lang: defaultLocale, rest: normalized };
}

/**
 * Resolve "if I were currently at <pathname> and I switched to <target>,
 * what URL should I go to?" — used by LanguageSwitcher.
 */
export function switchLocaleHref(pathname: string, target: Locale): string {
  const { rest } = parsePath(pathname);
  return localeHref(target, rest);
}

/**
 * Map a browser language tag (e.g. `zh-CN`, `zh-Hans-SG`, `zh-TW`,
 * `zh-Hant`, `en`, `en-US`) to one of our three supported locales.
 *
 * Strategy (precedence, top-down):
 *   1. Exact match on `zh-Hans` / `zh-Hant`.
 *   2. zh-Hant aliases: TW, HK, MO.
 *   3. zh-Hans aliases: CN, SG, MY, plain `zh` (mainland default).
 *   4. Anything starting with `en` → en.
 *   5. Fallback → defaultLocale (en).
 */
export function matchBrowserLocale(tag: string | undefined | null): Locale {
  if (!tag) return defaultLocale;
  const t = tag.replace(/_/g, "-").toLowerCase();
  if (t === "zh-hant" || t.startsWith("zh-hant-")) return "zh-Hant";
  if (t === "zh-hans" || t.startsWith("zh-hans-")) return "zh-Hans";
  // region-only tags
  const m = t.match(/^zh(?:-([a-z]{2,4}))?(?:-|$)/);
  if (m) {
    const region = m[1];
    if (region === "tw" || region === "hk" || region === "mo") return "zh-Hant";
    // cn / sg / my / undefined → simplified
    return "zh-Hans";
  }
  if (t === "en" || t.startsWith("en-")) return "en";
  return defaultLocale;
}

/**
 * Best-locale negotiation across an ordered preference list (typically
 * `navigator.languages`).
 */
export function negotiateLocale(prefs: readonly string[] | undefined): Locale {
  if (!prefs || prefs.length === 0) return defaultLocale;
  for (const p of prefs) {
    const m = matchBrowserLocale(p);
    if (m !== defaultLocale) return m;
    // If the very first preference is English, lock to English; otherwise
    // keep scanning in case the user's #1 is unsupported but #2 is zh.
    if (p.toLowerCase().startsWith("en")) return "en";
  }
  return defaultLocale;
}

/**
 * Absolute URL helper. Resolves `siteCore.url + localeHref(lang, path)`
 * and strips the trailing `/` that the root path would otherwise inject
 * (`localeHref("en", "/")` returns `"/"` because `<Link>` needs a
 * non-empty href; for canonical / og:url / sitemap entries we want the
 * bare domain `https://haozi.me` instead of `https://haozi.me/`).
 *
 * Other paths are passed through untouched -- `localeHref` already
 * never produces a trailing slash for non-root.
 */
export function localeUrl(lang: Locale, path: string): string {
  const href = localeHref(lang, path);
  const url = `${siteCore.url}${href}`;
  return url === `${siteCore.url}/` ? siteCore.url : url;
}

/**
 * Build the `metadata.alternates.canonical` + `.languages` map for a given
 * path. Returns absolute URLs (not paths) so callers can pass the result
 * straight into `openGraph.url` and `alternates.languages` without having
 * to re-resolve against `metadataBase`. All values are guaranteed to be
 * trailing-slash-free.
 */
export function buildAlternates(path: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  return {
    canonical: localeUrl(defaultLocale, path),
    languages: Object.fromEntries(
      locales.map((l) => [l, localeUrl(l, path)]),
    ),
  };
}

/** Storage keys for the client-side preference. Kept in one place. */
export const LOCALE_STORAGE_KEY = "haozi.locale";
export const LOCALE_COOKIE = "haozi_locale";
