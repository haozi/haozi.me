"use client";
import { useEffect, useRef, useState } from "react";

/**
 * BGM player ported faithfully from haozi.me's `vv` component:
 *
 *   - localStorage key: `haozi-bgm-time`
 *   - Default `currentTime = 2.5` (skips the first 2.5 s of intro silence)
 *   - On any document click → `audio.play().catch(() => {})`
 *   - Once `oncanplay` fires, the click listener self-removes
 *   - Every 1 s, write `audio.currentTime` to localStorage so a refresh
 *     resumes from where you left off
 *   - `audio.loop = true`
 *
 * The visible button at the bottom-left is an addition for explicit
 * play / pause control — the source had no UI, but a toggle is friendlier
 * than "click anywhere to start".
 */
const STORAGE_KEY = "haozi-bgm-time";
const DEFAULT_START_SECONDS = 2.5;
const PERSIST_INTERVAL_MS = 1000;

export function BgmToggle({ src = "/audio/bg.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    // Resume from saved position, or fall back to the source's 2.5 s offset.
    let saved = NaN;
    try {
      saved = parseFloat(localStorage.getItem(STORAGE_KEY) ?? "");
    } catch {
      // localStorage may throw in private mode; fall through to default
    }
    audio.currentTime = Number.isFinite(saved) ? saved : DEFAULT_START_SECONDS;

    // Track playing state from the actual element so external pauses
    // (e.g. the user pausing via OS-level media keys) keep the UI honest.
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // First-interaction autoplay — try `play()` immediately, swallow any
    // NotAllowedError, and re-attempt on the very next user gesture
    // anywhere in the document.
    //
    // BUG-FIX: previously the click listener was removed when the audio
    // fired `canplay`. But `canplay` fires when the file is loaded —
    // typically *before* any user interaction — so the listener got
    // pulled before the user's first click could ever land. Result:
    // clicking the XSS modal (or anywhere else) never triggered playback.
    //
    // Correct semantics: keep listening until `play()` actually resolves
    // successfully. Only then can we be sure autoplay was honoured and
    // it's safe to stop listening.
    let firstInteraction: ((e: Event) => void) | null = null;

    const removeGestureListeners = () => {
      if (!firstInteraction) return;
      document.removeEventListener("click", firstInteraction, true);
      document.removeEventListener("touchstart", firstInteraction, true);
      document.removeEventListener("keydown", firstInteraction, true);
      firstInteraction = null;
    };

    const tryPlay = () =>
      audio
        .play()
        .then(() => {
          // success → safe to drop the gesture listeners
          removeGestureListeners();
        })
        .catch(() => {
          /* autoplay denied; keep listeners armed for next gesture */
        });

    // Probe once at mount in case autoplay is permitted (e.g. media
    // session, prior interaction); harmless if blocked.
    tryPlay();

    firstInteraction = () => {
      tryPlay();
    };
    // capture-phase listener so it runs before any click handler that
    // might call stopPropagation() on a button further down the tree
    // (e.g. inside the XSS modal).
    document.addEventListener("click", firstInteraction, true);
    document.addEventListener("touchstart", firstInteraction, true);
    document.addEventListener("keydown", firstInteraction, true);

    // Persist current playhead every second so a refresh feels seamless.
    const persistTimer = window.setInterval(() => {
      try {
        if (Number.isFinite(audio.currentTime)) {
          localStorage.setItem(STORAGE_KEY, String(audio.currentTime));
        }
      } catch {
        /* ignore quota / privacy errors */
      }
    }, PERSIST_INTERVAL_MS);

    // Best-effort flush on tab unload.
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, String(audio.currentTime));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);

    return () => {
      window.clearInterval(persistTimer);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      // Capture-phase listeners must be removed with the same `true` flag
      // they were added with — and `removeGestureListeners()` already
      // does exactly that, plus the null-safety check.
      removeGestureListeners();
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      audio.pause();
      flush();
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  return (
    <span className="fixed left-2 bottom-2 z-30 [font-family:'Songti_SC',SimSun,serif]">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className={
          "px-3 py-0.5 text-xs text-black bg-[#c0c0c0] cursor-pointer [font:inherit] " +
          "border border-t-white border-l-white border-r-black border-b-black " +
          "[box-shadow:inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080] " +
          "active:border-t-black active:border-l-black active:border-r-white active:border-b-white " +
          "active:[box-shadow:inset_1px_1px_0_#808080,inset_-1px_-1px_0_#dfdfdf]"
        }
      >
        {playing ? "⏸ 暂停 BGM" : "▶ 播放 BGM"}
      </button>
      <audio ref={audioRef} src={src} loop preload="auto" />
    </span>
  );
}
