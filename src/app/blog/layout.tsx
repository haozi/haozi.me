import { SiteHeader } from "@/components/blog/SiteHeader";
import { SiteFooter } from "@/components/blog/SiteFooter";

/**
 * The "豁然一变" boundary. Once you cross from / into /blog (or any other
 * inner route under this layout's parent), the chrome and visual language
 * switch from retro-2003 to modern-blog (Starbucks-inspired light theme).
 *
 * The layout is shared across blog/tags/categories/archive — see /tags etc.
 * which import these same components.
 *
 * `data-skin="modern"` opts the subtree into the modern token system in
 * globals.css. The `modern-reveal` class plays the entry animation that
 * pairs with <Curtain /> when arriving from the retro homepage.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-skin="modern"
      className="modern-reveal flex min-h-dvh flex-col bg-[var(--color-canvas)] text-[color:var(--color-text)]"
    >
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
