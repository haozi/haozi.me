"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type Locale,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  locales,
  localeShortLabels,
  switchLocaleHref,
} from "@/lib/i18n";

/**
 * Three-way language switcher rendered next to the modern blog header
 * and inside the retro nav.
 *
 * Behaviour:
 *   - Renders three Links — one per supported locale — that preserve the
 *     current locale-stripped suffix (e.g. switching from /zh-Hans/blog/
 *     to en goes to /blog/, to zh-Hant goes to /zh-Hant/blog/).
 *   - On click, persists the chosen locale to localStorage AND a cookie
 *     so LocaleAutoDetect never bounces the user back.
 *   - Renders deterministic markup on the server (current = `current`
 *     prop) so SSG output is stable; the client effect only updates the
 *     `aria-current` after hydration if needed.
 */
export function LanguageSwitcher({
  current,
  variant = "modern",
  label,
}: {
  current: Locale;
  variant?: "modern" | "retro";
  /** A11y label for the group (e.g. "Language" / "语言" / "語言"). */
  label?: string;
}) {
  const pathname = usePathname() ?? "/";
  const [active, setActive] = useState<Locale>(current);

  useEffect(() => {
    setActive(current);
  }, [current]);

  function persist(target: Locale) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, target);
      // 1-year cookie so future server-side enhancements (if we ever
      // ship a non-static deploy) can read it too.
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${oneYear}; samesite=lax`;
    } catch {
      // private mode etc — best effort only.
    }
  }

  if (variant === "retro") {
    return (
      <span
        role="group"
        aria-label={label ?? "Language"}
        className="inline-flex items-center gap-1 align-middle"
      >
        {locales.map((l) => {
          const href = switchLocaleHref(pathname, l);
          const isActive = l === active;
          return (
            <Link
              key={l}
              href={href}
              onClick={() => persist(l)}
              aria-current={isActive ? "page" : undefined}
              className={
                "px-1.5 underline " +
                (isActive
                  ? "text-[#ffff00] font-bold"
                  : "text-[#0000ee] visited:text-[#800080]")
              }
            >
              [{localeShortLabels[l]}]
            </Link>
          );
        })}
      </span>
    );
  }

  return (
    <div
      role="group"
      aria-label={label ?? "Language"}
      className="inline-flex items-center overflow-hidden rounded-full border text-[12px] font-semibold"
      style={{
        borderColor: "var(--color-hairline)",
        background: "rgba(255,255,255,0.6)",
      }}
    >
      {locales.map((l) => {
        const href = switchLocaleHref(pathname, l);
        const isActive = l === active;
        return (
          <Link
            key={l}
            href={href}
            onClick={() => persist(l)}
            aria-current={isActive ? "page" : undefined}
            className="px-2.5 py-1 transition-colors"
            style={{
              background: isActive
                ? "var(--color-accent-green)"
                : "transparent",
              color: isActive ? "#fff" : "var(--color-text)",
              letterSpacing: "0.06em",
            }}
          >
            {localeShortLabels[l]}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Retro-skin convenience wrapper — used in the homepage's PHP-warning row.
 * Equivalent to `<LanguageSwitcher variant="retro" current={...} />` but
 * gives that call site a self-documenting name.
 */
export function RetroLanguageSwitcher(props: {
  current: Locale;
  label?: string;
}) {
  return <LanguageSwitcher variant="retro" {...props} />;
}
