import type { ReactNode } from "react";
import { LocaleAutoDetect } from "@/components/i18n/LocaleAutoDetect";
import { HtmlLangSync } from "@/components/i18n/HtmlLangSync";
import type { Locale } from "@/lib/i18n";

/**
 * Per-locale shell. NOT a root layout — `<html>` and `<body>` are owned
 * by `src/app/layout.tsx`. This wrapper only injects locale-specific
 * client-side concerns:
 *
 *   - `HtmlLangSync` keeps `documentElement.lang` honest for screen
 *     readers / crawlers that DO run JS.
 *   - `LocaleAutoDetect` redirects un-decided users on first visit per
 *     their `navigator.languages`.
 *
 * Mounted by each `app/<locale>/layout.tsx` (and `app/(en)/layout.tsx`
 * for the default locale). Cross-locale navigation is now soft because
 * all three locales share the single root layout.
 */
export function RootShell({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return (
    <>
      <HtmlLangSync lang={lang} />
      <LocaleAutoDetect current={lang} />
      {children}
    </>
  );
}
