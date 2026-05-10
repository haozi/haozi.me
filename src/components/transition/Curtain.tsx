"use client";

/**
 * Curtain — the 1999 → 2026 transition.
 *
 * Visual sequence (~1.1s, all CSS-driven). See the original component
 * comment for the choreography; nothing about the visual side changed.
 *
 * What DID change with i18n: the "modern" / "retro" path detection used
 * to do `pathname.startsWith("/blog")` etc. With locale prefixes, we now
 * strip the locale first via `parsePath` and apply the same checks to
 * the locale-stripped suffix. That keeps the curtain firing for
 * `/zh-Hans/` ↔ `/zh-Hans/blog/` exactly the same as `/` ↔ `/blog/`.
 *
 * `prefers-reduced-motion` collapses the whole thing to a 200ms
 * cross-fade.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { defaultLocale, parsePath } from "@/lib/i18n";

type Direction = "to-modern" | "to-retro" | null;

const MODERN_PREFIXES = ["/blog", "/posts", "/tags", "/categories", "/archive"];

function isModernPath(rest: string): boolean {
  return MODERN_PREFIXES.some((p) => rest === p || rest.startsWith(`${p}/`));
}

function isRetroPath(rest: string): boolean {
  return rest === "/" || rest === "";
}

export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<Direction>(null);
  const armedRef = useRef(false);

  const here = parsePath(pathname ?? "/");
  const isRetro = isRetroPath(here.rest);
  const isModern = isModernPath(here.rest);

  const startTransition = useCallback(
    (href: string, dir: Direction) => {
      if (armedRef.current) return;
      armedRef.current = true;
      setDirection(dir);
      // Navigate at the midpoint so DOM swap happens behind the curtain.
      window.setTimeout(() => {
        router.push(href);
      }, 480);
      // Tear down the curtain after the full sequence.
      window.setTimeout(() => {
        armedRef.current = false;
        setDirection(null);
      }, 1200);
    },
    [router],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Honor modifier keys (let cmd-click / ctrl-click open in new tab).
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target === "_blank") return;
      if (a.hasAttribute("download")) return;
      // Skip in-page anchors and external links.
      const href = a.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("http") || href.startsWith("mailto")) return;

      // The link belongs to which locale tree? Strip its prefix and
      // reuse the same path classifiers we use for `pathname`.
      const target_ = parsePath(href);

      // Cross-locale clicks (the language switcher) should NOT trigger
      // the curtain — they're full reloads handled by the browser.
      if (target_.lang !== here.lang) return;

      const goingToModern = isModernPath(target_.rest);
      const goingToRetro = isRetroPath(target_.rest);

      // Only fire when we cross the skin boundary within the same locale.
      if (isRetro && goingToModern) {
        e.preventDefault();
        startTransition(href, "to-modern");
      } else if (isModern && goingToRetro) {
        e.preventDefault();
        startTransition(href, "to-retro");
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isRetro, isModern, here.lang, startTransition]);

  // Reference defaultLocale to keep the import meaningful — the curtain
  // logic is locale-agnostic; defaultLocale is reachable here for future
  // tweaks (e.g. cross-locale curtain colours).
  void defaultLocale;

  if (!direction) return null;

  return (
    <div
      className={`curtain curtain-active curtain--${direction}`}
      aria-hidden="true"
    >
      <div className="curtain-fill" />
      <div className="curtain-line" />
      <div className="curtain-flash" />
      <div className="curtain-cream" />
    </div>
  );
}
