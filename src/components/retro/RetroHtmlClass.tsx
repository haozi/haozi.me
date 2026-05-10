"use client";

import { useEffect } from "react";

/**
 * Adds `retro-active` to `<html>` while the homepage is mounted; removes
 * it on unmount (e.g. route change to /blog).
 *
 * Why a class on `<html>` instead of `:has(.retro-root)` on the document?
 *
 *   The retro homepage's Win98 scrollbar relies on `::-webkit-scrollbar`
 *   pseudo-element rules. macOS Safari has a known cascade bug where
 *   `:has()` composed with `::-webkit-scrollbar` does NOT apply — the
 *   pseudo-element rules silently fall back to the system overlay
 *   scrollbar, which on macOS hides when the page is idle (the very bug
 *   the user reported).
 *
 *   A flat `html.retro-active::-webkit-scrollbar` selector with no
 *   `:has()` parses correctly in all WebKit / Blink versions and forces
 *   the browser into "custom-painted" scrollbar mode, which is always
 *   visible regardless of the macOS "Show scroll bars" system pref.
 *
 *   The cleanup on unmount keeps the modern /blog skin completely free
 *   of retro scrollbars (hard rule #2: blog must stay calm/modern).
 *
 * Renders nothing.
 */
export function RetroHtmlClass() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("retro-active");
    return () => {
      html.classList.remove("retro-active");
    };
  }, []);
  return null;
}
