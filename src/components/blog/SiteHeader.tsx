import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

/**
 * Modern blog header — Starbucks-inspired light skin, locale-aware.
 *
 *  - Cream canvas background (#f2f0eb) with whisper triple-layer shadow
 *  - Left: site wordmark in Starbucks Green (weight 600, -0.01em)
 *  - Center: nav links (hover: Green Accent underline)
 *  - Right: outline-green pill RSS CTA + a single filled-green CTA "Home"
 *           which routes back to the retro homepage (triggering the
 *           reverse "to-retro" curtain) + the language switcher.
 *
 * Internal links flow through `localeHref(lang, ...)` so that switching
 * to /zh-Hans keeps the user inside their locale tree.
 */
export function SiteHeader({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
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
          href={localeHref(lang, "/blog")}
          className="text-[20px] font-semibold tracking-tight"
          style={{ color: "var(--color-brand-green)" }}
        >
          {d.site.shortName}
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-[15px] md:flex">
          <HeaderLink href={localeHref(lang, "/blog")} label={d.blog.blog} />
          <HeaderLink
            href={localeHref(lang, "/archive")}
            label={d.blog.archive}
          />
          <HeaderLink href={localeHref(lang, "/tags")} label={d.blog.tags} />
          <HeaderLink
            href={localeHref(lang, "/categories")}
            label={d.blog.categories}
          />
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher current={lang} label={d.switcher.label} />
          <a
            href={lang === "en" ? "/rss.xml" : `/${lang}/rss.xml`}
            className="modern-pill modern-pill--outline hidden sm:inline-flex"
          >
            {d.blog.rss}
          </a>
          <Link
            href={localeHref(lang, "/")}
            className="modern-pill modern-pill--filled"
          >
            {d.blog.home_pill}
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
