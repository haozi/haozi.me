import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Modern blog header — Starbucks-inspired light skin.
 *
 *  - Cream canvas background (#f2f0eb) with whisper triple-layer shadow
 *  - Left: site wordmark in Starbucks Green (weight 600, -0.01em)
 *  - Center: nav links (hover: Green Accent underline)
 *  - Right: outline-green pill RSS CTA + a single filled-green CTA "Home"
 *           which routes back to the retro homepage (triggering the
 *           reverse "to-retro" curtain).
 */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur"
      style={{
        background: "rgba(242, 240, 235, 0.92)",
        boxShadow: "var(--shadow-nav)",
        letterSpacing: "var(--tracking-tight)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1100px] items-center gap-6 px-4 sm:px-6">
        <Link
          href="/blog"
          className="text-[20px] font-semibold tracking-tight"
          style={{ color: "var(--color-brand-green)" }}
        >
          {site.shortName ?? site.name}
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-[15px] md:flex">
          <HeaderLink href="/blog" label="Blog" />
          <HeaderLink href="/archive" label="Archive" />
          <HeaderLink href="/tags" label="Tags" />
          <HeaderLink href="/categories" label="Categories" />
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="/rss.xml"
            className="modern-pill modern-pill--outline hidden sm:inline-flex"
          >
            RSS
          </a>
          <Link href="/" className="modern-pill modern-pill--filled">
            ← 1999
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative inline-flex h-[36px] items-center px-1 text-[color:var(--color-text)] transition-colors hover:text-[color:var(--color-accent-green)]"
    >
      <span>{label}</span>
    </Link>
  );
}
