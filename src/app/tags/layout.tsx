import type { ReactNode } from "react";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { SiteFooter } from "@/components/blog/SiteFooter";

export default function TagsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-skin="modern"
      className="flex min-h-dvh flex-col bg-[var(--color-canvas)] text-[color:var(--color-text)]"
    >
      <SiteHeader />
      <main className="modern-reveal flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
