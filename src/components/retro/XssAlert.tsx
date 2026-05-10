"use client";
import type * as React from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Win98 3D bevel — top/left highlight, bottom/right shadow, with the
 * classic inset double-hairline. The `:active` state inverts every
 * direction (pressed-in look). Tailwind utility soup, all literal.
 */
const WIN98_BEVEL =
  "border border-t-white border-l-white border-r-black border-b-black " +
  "[box-shadow:inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080] " +
  "active:border-t-black active:border-l-black active:border-r-white active:border-b-white " +
  "active:[box-shadow:inset_1px_1px_0_#808080,inset_-1px_-1px_0_#dfdfdf]";

const WIN98_BTN =
  "bg-[#c0c0c0] text-black cursor-pointer [font-family:inherit] " +
  WIN98_BEVEL;

/**
 * SSR-safe "am I on the client?" hook.
 *
 * The classic `const [m, setM] = useState(false); useEffect(() => setM(true), [])`
 * pattern trips React 19's `react-hooks/set-state-in-effect` rule (cascading-
 * renders smell). `useSyncExternalStore` is the React-blessed replacement:
 * the server snapshot returns `false`, the client snapshot returns `true`,
 * and React handles the hydration swap without a setState-in-effect.
 *
 * The `subscribe` arg is a noop because client-mounted-ness never changes
 * after first paint.
 */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Module-level "已弹过" 标记。**故意不持久化**：
 *   - 不写 localStorage / sessionStorage —— 用户明确要"内存里记住"，
 *     刷新页面后应该还能再弹一次（保留 XSS 段子的初见感）。
 *   - 模块作用域跨 SPA 路由切换共享：`/` → `/blog` → `/` 回到首页时
 *     不会重复弹（IntersectionObserver 重新挂载也只读到 true 就跳过）。
 *   - 子组件 unmount 也不会重置，因为它就是个 module-scoped 变量。
 */
let xssAlertSeen = false;

/**
 * Faithful port of haozi.me's `sa` + `hv` + `pv` components. When the
 * `<p class="i-xss">` line scrolls into view (10 % visibility), a Win98-
 * styled "alert" modal pops up showing `/xss/`. Clicking OK opens
 * `//xss.haozi.me/` in a new tab; Cancel closes the modal.
 *
 * The original uses IntersectionObserver with a 1 s start delay so the
 * modal doesn't fire on initial page load before the user scrolls.
 *
 * **Once-per-session semantics** (in-memory only, see `xssAlertSeen` above):
 * after the modal opens once it stays "seen" for the lifetime of this
 * JS module — SPA route navigation back to `/` won't re-pop. A hard
 * refresh resets the flag so the joke still lands on a brand-new visit.
 *
 * The wrapping `<p ref={...}>` lives inline in `page.tsx`; this
 * component just exposes a `useXssAlert(ref)` hook + `<XssAlertModal />`
 * so the page composes them together cleanly.
 */
export function useXssAlertOnScroll(ref: React.RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Already shown earlier in this session — don't even arm the
    // observer. Saves a wakeup + keeps the user from seeing the modal
    // a second time after SPA-navigating away and back.
    if (xssAlertSeen) return;

    const target = ref.current;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !xssAlertSeen) {
          xssAlertSeen = true;
          setOpen(true);
          // disconnect immediately — once is once.
          io.disconnect();
        }
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
  const mounted = useIsClient();

  if (!mounted || !open) return null;

  const node = (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center pt-[12vh] bg-transparent pointer-events-none [font-family:'Pixelated_MS_Sans_Serif','MS_Sans_Serif',Arial,sans-serif]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={
          "pointer-events-auto bg-[#c0c0c0] text-black min-w-[240px] p-[3px] " +
          "border border-t-white border-l-white border-r-black border-b-black " +
          "[box-shadow:inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080,2px_2px_6px_rgba(0,0,0,0.4)]"
        }
      >
        <div className="flex items-center justify-between pt-[3px] pr-[2px] pb-[3px] pl-[4px] [background:linear-gradient(90deg,#000080_0%,#1084d0_100%)] text-white font-bold text-[11px] tracking-normal">
          <span className="flex-1">{title}</span>
          <button
            type="button"
            className={
              "w-[18px] h-4 p-0 ml-2 text-[11px] leading-none " + WIN98_BTN
            }
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="pt-[14px] px-[14px] pb-[10px]">
          <p className="m-0 mb-[14px] text-xs break-all">{children}</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className={
                "min-w-[64px] py-1 px-[14px] text-[11px] " +
                "focus:[outline:1px_dotted_#000] focus:[outline-offset:-4px] " +
                WIN98_BTN
              }
              onClick={() => {
                onOK?.();
                onClose();
              }}
            >
              OK
            </button>
            <button
              type="button"
              className={
                "min-w-[64px] py-1 px-[14px] text-[11px] " +
                "focus:[outline:1px_dotted_#000] focus:[outline-offset:-4px] " +
                WIN98_BTN
              }
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
      <p
        className="bg-white px-2 py-1 my-3 text-sm text-black"
        ref={ref}
      >
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

