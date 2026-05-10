import type { ReactNode } from "react";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { SiteFooter } from "@/components/blog/SiteFooter";
import type { Locale } from "@/lib/i18n";

/**
 * Shared modern-skin layout chrome for the blog/archive/tags/categories
 * subtrees. Locale-aware. Mirrors the pre-i18n `BlogLayout` /
 * `ArchiveLayout` / `TagsLayout` / `CategoriesLayout` files exactly so the
 * Starbucks-light look is preserved.
 */
export function ModernShell({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return (
    <div
      data-skin="modern"
      className="modern-reveal flex min-h-dvh flex-col bg-[var(--color-canvas)] text-[color:var(--color-text)]"
    >
      <SiteHeader lang={lang} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
