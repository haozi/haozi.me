"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

/**
 * Modern Table-of-Contents — sticky right rail, scroll-spy.
 *
 *   - Title in Starbucks Green (uppercase 12px, 0.12em letter-spacing)
 *   - Hairline left border in --color-hairline
 *   - Active item: 2px Green Accent left border + Green Accent text + weight 600
 *   - Inactive: muted text, transparent border
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const observers: IntersectionObserver[] = [];
    const handler: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) {
        setActive(visible[0].target.id);
      }
    };
    const obs = new IntersectionObserver(handler, {
      rootMargin: "0px 0px -70% 0px",
      threshold: 0,
    });
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) obs.observe(el);
    }
    observers.push(obs);
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="目录" className="text-[13px]">
      <p
        className="mb-3 text-[12px] font-semibold uppercase"
        style={{
          color: "var(--color-accent-green)",
          letterSpacing: "0.12em",
        }}
      >
        目录
      </p>
      <ul
        className="space-y-1.5 border-l"
        style={{ borderColor: "var(--color-hairline)" }}
      >
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.depth - 2) * 12 + 14}px` }}
            >
              <a
                href={`#${item.id}`}
                className="block -ml-[2px] border-l-2 py-1 leading-snug transition-colors"
                style={{
                  borderColor: isActive
                    ? "var(--color-accent-green)"
                    : "transparent",
                  color: isActive
                    ? "var(--color-accent-green)"
                    : "var(--color-text-soft)",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
