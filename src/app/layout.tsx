import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeBootstrap } from "@/components/blog/ThemeBootstrap";
import { Curtain } from "@/components/transition/Curtain";
import { TrailingSlashStripper } from "@/components/transition/TrailingSlashStripper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Single shared root layout for every locale.
 *
 * Why one root (vs. one per locale)
 * ---------------------------------
 * Next.js App Router treats every `<html>` as a separate "app" — soft
 * navigation between two root layouts is impossible (framework contract:
 * the entire HTML shell has to be replaced, which is a full reload).
 * Multi-root was tempting because it lets each locale bake its `<html
 * lang>` statically, but the cost is that clicking the language switcher
 * forces a hard reload, which the user noticed.
 *
 * Collapsing to one root makes `/blog` ↔ `/zh-Hans/blog` a normal RSC
 * navigation: the router fetches the new tree, swaps the locale subtree
 * (which now has a regular non-root layout), and the user keeps their
 * scroll / focus / state.
 *
 * The trade-off — `<html lang>` is a single static `"en"` at build time
 * — is patched on the client by `HtmlLangSync`, mounted by each
 * per-locale layout. See that component for the SEO rationale.
 *
 * Locale-agnostic chrome lives here:
 *   - Inter font (locale-independent — CJK glyphs come from system stack)
 *   - ThemeBootstrap (light-theme lock)
 *   - TrailingSlashStripper (`history.pushState`/`replaceState` patch)
 *   - Curtain (the 1999 ↔ 2026 transition; locale-aware internally via
 *     `parsePath`)
 *
 * Per-locale concerns (metadata, dictionary, HtmlLangSync,
 * LocaleAutoDetect) live in each locale's own non-root layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-dvh">
        <TrailingSlashStripper />
        <ThemeBootstrap />
        {children}
        <Curtain />
      </body>
    </html>
  );
}
