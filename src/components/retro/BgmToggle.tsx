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
    let onCanPlay: (() => void) | null = null;
    let firstInteraction: ((e: Event) => void) | null = null;

    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    firstInteraction = () => {
      tryPlay();
    };
    onCanPlay = () => {
      // mirror the source's behaviour: once the audio is ready and we
      // know we can play, drop the global click listener so we don't
      // hijack later clicks.
      if (firstInteraction) {
        document.removeEventListener("click", firstInteraction);
        document.removeEventListener("touchstart", firstInteraction);
        document.removeEventListener("keydown", firstInteraction);
      }
    };
    audio.addEventListener("canplay", onCanPlay);
    document.addEventListener("click", firstInteraction);
    document.addEventListener("touchstart", firstInteraction);
    document.addEventListener("keydown", firstInteraction);

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
      if (onCanPlay) audio.removeEventListener("canplay", onCanPlay);
      if (firstInteraction) {
        document.removeEventListener("click", firstInteraction);
        document.removeEventListener("touchstart", firstInteraction);
        document.removeEventListener("keydown", firstInteraction);
      }
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
    <span className="retro-bgm">
      <button type="button" onClick={toggle} aria-pressed={playing}>
        {playing ? "⏸ 暂停 BGM" : "▶ 播放 BGM"}
      </button>
      <audio ref={audioRef} src={src} loop preload="auto" />
    </span>
  );
}
