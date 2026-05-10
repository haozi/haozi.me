"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Faithful port of haozi.me's slow-canvas-paint algorithm. The original
 * (Vite bundle `index.b26d234e.js`) does this:
 *
 *   const sv  = (e) => new Promise(t => setTimeout(t, e * 1000));
 *   const h   = [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.7];
 *   const m   = (imgData, yPx) => {
 *     // copy the top yPx rows of pixels from imgData into a fresh
 *     // ImageData; the rest stays as transparent black.
 *     const fresh = ctx.createImageData(imgData.width, imgData.height);
 *     for (let C = 0; fresh.data[C] = imgData.data[C],
 *                     !(C >= imgData.width * yPx * 4); C++);
 *     ctx.putImageData(fresh, 0, 0);
 *   };
 *   const E   = async (y) => {
 *     for (const d of h) { m(y, y.height * d); await sv(3); }
 *     setFinished(true);
 *   };
 *   img.onload = async () => {
 *     ... drawImage(img) on offscreen, getImageData → y;
 *     await E(y), g(width, height);   // ← fillRect white at the end!
 *   };
 *
 * The total reveal takes 7 × 3s = **21 seconds**. After it finishes,
 * `g()` fillRects the whole canvas white — that's the source's gag:
 * the photo reveals slowly and the moment it "finishes" it whitewashes
 * to "loaded successfully", with the checkmark badge added via the
 * `.retro-portrait-done` class.
 *
 * Click-to-open the original src is also preserved.
 */
const REVEAL_FRACTIONS = [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.7] as const;
const STEP_SECONDS = 3;

const sleep = (sec: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));

export function SlowCanvasPortrait({
  src = "/retro/avatar.png",
  width = 500,
  height = 666.667,
}: {
  src?: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setFinished(false);

    const img = new Image();
    let cancelled = false;

    img.onload = async () => {
      if (cancelled) return;

      const { naturalWidth: imgW, naturalHeight: imgH } = img;
      // Match the source's CSS-pixel display at 500×666.667 while
      // keeping the canvas internal buffer at the image's native size
      // so getImageData/putImageData operate on real pixels.
      canvas.width = imgW;
      canvas.height = imgH;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // off-screen rasterisation → ImageData
      const off = document.createElement("canvas");
      off.width = imgW;
      off.height = imgH;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0);
      const fullData = offCtx.getImageData(0, 0, imgW, imgH);

      // m(): replace canvas pixels with a fresh ImageData where only the
      // top `yPx` rows are populated from the source — exact byte-copy
      // semantics from the original.
      const reveal = (yPx: number) => {
        const fresh = ctx.createImageData(imgW, imgH);
        const cutoff = imgW * yPx * 4;
        // Byte-copy semantics ported from haozi.me's original — copy the
        // top-`yPx` rows of RGBA bytes into a fresh ImageData. The original
        // squeezed the assignment into the for-condition (and required a
        // no-empty disable); pulled out into the body for lint cleanliness
        // and zero behaviour change.
        for (let c = 0; c < cutoff; c++) {
          fresh.data[c] = fullData.data[c];
        }
        ctx.putImageData(fresh, 0, 0);
      };

      // 7-step reveal × 3s sleep — the deliberate 21-second crawl.
      for (const fraction of REVEAL_FRACTIONS) {
        if (cancelled) return;
        reveal(imgH * fraction);
        await sleep(STEP_SECONDS);
      }
      if (cancelled) return;
      setFinished(true);

      // Source's final gag: whitewash the canvas right after the badge
      // appears, mirroring `g(L, d)` in the original bundle.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, imgW, imgH);
    };

    img.onerror = () => {
      if (cancelled) return;
      // graceful fallback so the layout never collapses
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000080";
      ctx.font = "14px SimSun";
      ctx.textAlign = "center";
      ctx.fillText("(图片加载失败)", canvas.width / 2, canvas.height / 2);
      setFinished(true);
    };

    img.crossOrigin = "*";
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, width, height]);

  return (
    <figure
      // `retro-portrait-done` survives as a class hook because the
      // finished-loading badge is a `::before` pseudo-element rendered
      // by the inline retro stylesheet in `src/app/page.tsx` — pseudo
      // elements aren't expressible via Tailwind utilities.
      className={
        "relative block text-center my-3" +
        (finished ? " retro-portrait-done" : "")
      }
    >
      <canvas
        ref={canvasRef}
        className="border-4 border-[#0000ff] cursor-pointer max-w-full h-auto"
        width={1080}
        height={1440}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={() => window.open(src)}
        aria-label="耗子的网吧自拍 (慢速加载中)"
      />
    </figure>
  );
}
