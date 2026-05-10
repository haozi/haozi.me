import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";
import { siteCore } from "@/lib/site";

/**
 * Modern blog footer — House Green band (espresso bookend), locale-aware.
 *
 *  - Background: House Green (#1E3932)
 *  - Text: white primary, rgba(255,255,255,0.70) secondary
 *  - Generous 56–64px vertical padding (Starbucks rhythm)
 */
export function SiteFooter({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const year = new Date().getFullYear();
  const rssHref = lang === "en" ? "/rss.xml" : `/${lang}/rss.xml`;
  return (
    <footer
      className="mt-24"
      style={{
        background: "var(--color-house-green)",
        color: "var(--color-text-on-dark)",
        letterSpacing: "var(--tracking-tight)",
      }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-[44%]">
          <p
            className="text-[24px] font-semibold leading-tight"
            style={{ letterSpacing: "-0.012em" }}
          >
            {d.site.shortName}
          </p>
          <p
            className="mt-3 text-[15px] leading-[1.7]"
            style={{ color: "var(--color-text-on-dark-soft)" }}
          >
            {d.site.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={localeHref(lang, "/")}
              className="modern-pill"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              {d.blog.home_pill_long}
            </Link>
            <a
              href={rssHref}
              className="modern-pill"
              style={{
                background: "#fff",
                color: "var(--color-accent-green)",
                border: "1px solid #fff",
              }}
            >
              {d.blog.rss}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[14px] sm:grid-cols-3">
          <FooterCol title={d.blog.cols.read}>
            <FooterLink href={localeHref(lang, "/blog")} label={d.blog.blog} />
            <FooterLink
              href={localeHref(lang, "/archive")}
              label={d.blog.archive}
            />
          </FooterCol>
          <FooterCol title={d.blog.cols.browse}>
            <FooterLink href={localeHref(lang, "/tags")} label={d.blog.tags} />
            <FooterLink
              href={localeHref(lang, "/categories")}
              label={d.blog.categories}
            />
          </FooterCol>
          <FooterCol title={d.blog.cols.author}>
            <FooterLink
              href={siteCore.author.url}
              label={siteCore.author.name}
              external
            />
            <FooterLink href={rssHref} label={d.blog.rss_feed} external />
          </FooterCol>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:px-6"
          style={{ color: "var(--color-text-on-dark-soft)" }}
        >
          <span>
            © 1999–{year} {d.site.shortName}. All rights reserved.
          </span>
          <span>{d.blog.footer_built}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="mb-3 text-[12px] font-semibold uppercase"
        style={{
          color: "var(--color-text-on-dark-soft)",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--color-text-on-dark)] transition-opacity hover:opacity-80"
        >
          {label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={href}
        className="text-[color:var(--color-text-on-dark)] transition-opacity hover:opacity-80"
      >
        {label}
      </Link>
    </li>
  );
}
