"use client";
import { useEffect, useRef } from "react";

/**
 * Full-viewport fireworks overlay — restores the missing element from
 * haozi.me's `index2.html`:
 *
 *   <div style="pointer-events:none;position:fixed;inset:0">
 *     <canvas></canvas>
 *   </div>
 *
 * Visual style is the canonical late-90s / 2000s Flash ".swf" fireworks
 * look that was ubiquitous on Chinese personal sites:
 *
 *   - Particles render as LINE SEGMENTS (prev → current position), not
 *     dots. This is the defining Flash hallmark — the streak, not the
 *     point.
 *   - HSL colour with random hue jitter per particle for the "sparkle".
 *   - Trail fade via a translucent black `fillRect` over the whole
 *     canvas every frame (no `clearRect`, no `destination-out`). This
 *     is the classic 2000s technique: streaks linger 6–10 frames before
 *     fully fading.
 *   - Additive blending (`lighter`) so overlapping particles bloom to
 *     white — the firework "core" feel.
 *   - Rockets ascend with gravity and burst into 60–100 particles.
 *   - Auto-launch every ~1.4s + click anywhere to spawn a burst.
 *   - DPR-aware sizing; ResizeObserver keeps the canvas viewport-sized.
 *   - prefers-reduced-motion → animation paused, canvas blank.
 *
 * The prev-position streak + lighter-blend + black-rect-fade technique
 * has been a staple of canvas particle demos since the early 2010s.
 * Implementation here is independent.
 */

// ── Tunables ─────────────────────────────────────────────────────────
const AUTO_INTERVAL_MS = 1400;
const ROCKET_GRAVITY = 0.05;
const ROCKET_VY_MIN = -7.5;
const ROCKET_VY_MAX = -10.5;
const PARTICLE_COUNT_MIN = 60;
const PARTICLE_COUNT_MAX = 100;
const PARTICLE_SPEED_MIN = 1;
const PARTICLE_SPEED_MAX = 8;
const PARTICLE_FRICTION = 0.95;
const PARTICLE_GRAVITY = 0.04;
const PARTICLE_DECAY_MIN = 0.005;
const PARTICLE_DECAY_MAX = 0.014;
const TRAIL_FADE = 0.18;

type Rocket = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  hue: number;
  brightness: number;
  targetY: number;
};

type Particle = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  hue: number;
  brightness: number;
  alpha: number;
  decay: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const irand = (a: number, b: number) => Math.floor(rand(a, b));

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;
    ro?.observe(document.documentElement);
    window.addEventListener("resize", resize);

    if (reduced) {
      // honour reduced motion: leave canvas mounted but never animate.
      return () => {
        window.removeEventListener("resize", resize);
        ro?.disconnect();
      };
    }

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];

    const launch = (tx?: number, ty?: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = tx ?? rand(w * 0.2, w * 0.8);
      const y = ty ?? rand(h * 0.15, h * 0.5);
      rockets.push({
        x,
        y: h + 4,
        prevX: x,
        prevY: h + 4,
        vx: rand(-0.5, 0.5),
        vy: rand(ROCKET_VY_MAX, ROCKET_VY_MIN),
        hue: irand(0, 360),
        brightness: 60,
        targetY: y,
      });
    };

    const explode = (x: number, y: number, hue: number) => {
      const count = irand(PARTICLE_COUNT_MIN, PARTICLE_COUNT_MAX);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);
        particles.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue: hue + irand(-20, 20),
          brightness: irand(50, 80),
          alpha: 1,
          decay: rand(PARTICLE_DECAY_MIN, PARTICLE_DECAY_MAX),
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      // click-to-burst at the cursor — pointer-events:none on the wrapper
      // means the click hits the document, not the canvas, so we listen
      // globally and spawn a burst at the click coordinates.
      explode(e.clientX, e.clientY, irand(0, 360));
    };
    document.addEventListener("click", onClick);

    const autoTimer = window.setInterval(() => launch(), AUTO_INTERVAL_MS);
    // first rocket immediately so the page never looks empty on load.
    launch();

    let raf = 0;
    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Trail fade — ERASE (not paint) ${TRAIL_FADE} of existing pixels
      // each frame. We MUST use destination-out here, not source-over with
      // translucent black, because `source-over` accumulates alpha across
      // frames (1 - 0.82^N → ~86% opaque after 10 frames) and silently
      // turns the canvas into a near-black sheet that hides the page's
      // tiled GIF wallpaper underneath. destination-out wipes pixels and
      // leaves the canvas truly transparent where no firework is drawn.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // ── Rockets ────────────────────────────────────────────────
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.prevX = r.x;
        r.prevY = r.y;
        r.x += r.vx;
        r.y += r.vy;
        r.vy += ROCKET_GRAVITY;

        ctx.beginPath();
        ctx.moveTo(r.prevX, r.prevY);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = `hsl(${r.hue}, 100%, ${r.brightness}%)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // burst when the rocket reaches its target altitude or stalls
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      // ── Particles ──────────────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.prevX = p.x;
        p.prevY = p.y;
        p.vx *= PARTICLE_FRICTION;
        p.vy *= PARTICLE_FRICTION;
        p.vy += PARTICLE_GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(autoTimer);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
