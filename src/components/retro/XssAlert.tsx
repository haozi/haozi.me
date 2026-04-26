"use client";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Faithful port of haozi.me's `sa` + `hv` + `pv` components. When the
 * `<p class="i-xss">` line scrolls into view (10 % visibility), a Win98-
 * styled "alert" modal pops up showing `/xss/`. Clicking OK opens
 * `//xss.haozi.me/` in a new tab; Cancel closes the modal.
 *
 * The original uses IntersectionObserver with a 1 s start delay so the
 * modal doesn't fire on initial page load before the user scrolls.
 *
 * The wrapping `<p ref={...}>` lives inline in `page.tsx`; this
 * component just exposes a `useXssAlert(ref)` hook + `<XssAlertModal />`
 * so the page composes them together cleanly.
 */
export function useXssAlertOnScroll(ref: React.RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOpen(true);
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    // delay observation by 1s — matches the source's `setTimeout(io.observe, 1000)`
    const t = window.setTimeout(() => io.observe(target), 1000);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [ref]);

  return { open, close: () => setOpen(false) };
}

export function XssAlertModal({
  open,
  onClose,
  onOK,
  title = "alert",
  children = "/xss/",
}: {
  open: boolean;
  onClose: () => void;
  onOK?: () => void;
  title?: string;
  children?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  const node = (
    <div className="retro-modal-backdrop" role="dialog" aria-modal="true">
      <div className="retro-modal-window">
        <div className="retro-modal-titlebar">
          <span className="retro-modal-title">{title}</span>
          <button
            type="button"
            className="retro-modal-x"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="retro-modal-body">
          <p className="retro-modal-content">{children}</p>
          <div className="retro-modal-buttons">
            <button
              type="button"
              className="retro-modal-btn"
              onClick={() => {
                onOK?.();
                onClose();
              }}
            >
              OK
            </button>
            <button
              type="button"
              className="retro-modal-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

/**
 * Self-contained `<p class="i-xss">` + modal pair. Lets the homepage
 * stay a Server Component — only this little island runs on the client.
 */
export function XssLine() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { open, close } = useXssAlertOnScroll(ref);
  return (
    <>
      <p className="i-xss" ref={ref}>
        {`"><SCRIPT >alert(/xss/)</SCRIPT>">`}
      </p>
      <XssAlertModal
        open={open}
        onClose={close}
        onOK={() => window.open("//xss.haozi.me/")}
      >
        /xss/
      </XssAlertModal>
    </>
  );
}

