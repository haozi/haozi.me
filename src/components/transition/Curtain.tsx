"use client";

/**
 * Curtain — the 1999 → 2026 transition.
 *
 * Visual sequence (~1.1s, all CSS-driven):
 *
 *   0–200ms   CRT collapse: a 1px phosphor-green horizontal line erupts
 *             across the viewport (scaleX 0 → 1).
 *   200–350ms The line stretches vertically into a green flash, then
 *             snaps back to a hairline (the classic "TV switching off"
 *             gesture, in reverse — turning *on* into the future).
 *   350–600ms A radial green flash blooms and fades; underneath, the
 *             cream canvas (#f2f0eb) cross-fades up from black.
 *   600–1100ms Curtain fades out, revealing the modern blog page,
 *             which has its own .modern-reveal entry animation
 *             (translateY + blur clear).
 *
 * The component is rendered globally in the root layout but only
 * activates when a link with `data-curtain` is clicked while the
 * current route starts with `/` (retro home) and the destination
 * starts with `/blog` (or any non-retro path).
 *
 * It also activates when navigating *back* from blog → home, in
 * reverse (cream collapses to a green hairline, then flashes black —
 * "shutting down to 1999").
 *
 * `prefers-reduced-motion` collapses the whole thing to a 200ms
 * cross-fade.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

type Direction = "to-modern" | "to-retro" | null;

export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<Direction>(null);
  const armedRef = useRef(false);

  const isRetro = pathname === "/" || pathname === "";
  const isModern = pathname?.startsWith("/blog") ||
                   pathname?.startsWith("/posts") ||
                   pathname?.startsWith("/tags") ||
                   pathname?.startsWith("/categories") ||
                   pathname?.startsWith("/archive");

  const startTransition = useCallback((href: string, dir: Direction) => {
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
  }, [router]);

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

      const goingToModern =
        href.startsWith("/blog") ||
        href.startsWith("/posts") ||
        href.startsWith("/tags") ||
        href.startsWith("/categories") ||
        href.startsWith("/archive");
      const goingToRetro = href === "/" || href === "";

      // Only fire when we cross the skin boundary.
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
  }, [isRetro, isModern, startTransition]);

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
