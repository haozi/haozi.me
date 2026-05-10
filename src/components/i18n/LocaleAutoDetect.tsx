"use client";

import { useEffect } from "react";
import {
  type Locale,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  defaultLocale,
  isLocale,
  negotiateLocale,
  parsePath,
  switchLocaleHref,
} from "@/lib/i18n";

/**
 * Client-only locale detector.
 *
 * Mounted ONCE per page (in each root layout). Runs at most once per
 * session per route:
 *
 *   1. Read the persisted preference (localStorage → cookie). If the
 *      user has already chosen, do nothing — even if their browser
 *      languages disagree.
 *   2. Otherwise, negotiate `navigator.languages` → matched Locale.
 *   3. If the matched locale differs from the current page's locale
 *      (`current` prop, set by the server-side route at build time),
 *      replace the URL with the locale-equivalent path. We use
 *      `window.location.replace` rather than `router.replace` because
 *      different locales live under different root layouts (multi-root
 *      pattern) and a soft navigation would not switch layouts.
 *
 * Static-export contract: this is a no-op during build (the component
 * renders nothing). All work happens in `useEffect`, which only runs
 * in the browser.
 */
export function LocaleAutoDetect({ current }: { current: Locale }) {
  useEffect(() => {
    try {
      // 1. Persisted preference wins.
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      const cookied = readCookie(LOCALE_COOKIE);
      const remembered = isLocale(stored)
        ? stored
        : isLocale(cookied)
          ? cookied
          : null;

      if (remembered) {
        if (remembered !== current) {
          redirectTo(remembered);
        }
        return;
      }

      // 2. No preference yet — negotiate from the browser.
      const langs = (navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language]) as readonly string[];
      const matched: Locale = negotiateLocale(langs);

      // 3. Persist the negotiated value so we never bounce again, then
      //    redirect if needed. We persist the negotiated locale even
      //    when no redirect is required so a later visit to a different
      //    locale's URL doesn't trigger a second negotiation.
      window.localStorage.setItem(LOCALE_STORAGE_KEY, matched);
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `${LOCALE_COOKIE}=${matched}; path=/; max-age=${oneYear}; samesite=lax`;

      if (matched !== current && matched !== defaultLocale) {
        redirectTo(matched);
      } else if (matched === defaultLocale && current !== defaultLocale) {
        // Edge case: user landed on /zh-Hans/ but their browser is en
        // and they have no preference yet. Don't bounce them away from
        // the explicitly requested URL — respect the URL, just persist.
      }
    } catch {
      // SecurityError on storage / no navigator — leave the page alone.
    }
  }, [current]);

  return null;
}

function redirectTo(target: Locale) {
  try {
    const path = window.location.pathname + window.location.search + window.location.hash;
    // No trailing-slash preservation: the site is configured with
    // `trailingSlash: false`, so canonical hrefs never end in `/` (except
    // the bare site root). `switchLocaleHref` already returns the right
    // shape — we just append query + hash.
    const href =
      switchLocaleHref(window.location.pathname, target) +
      window.location.search +
      window.location.hash;
    if (href !== path) {
      // `replace` so the un-localized URL doesn't pollute browser history.
      window.location.replace(href);
    }
  } catch {
    /* ignore */
  }
}

function readCookie(name: string): string | null {
  try {
    const m = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"),
    );
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}
