import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

export function NotFoundPage({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  return (
    <div
      data-skin="modern"
      className="flex min-h-dvh items-center justify-center px-6"
      style={{
        background: "var(--color-canvas)",
        color: "var(--color-text)",
        letterSpacing: "var(--tracking-tight)",
      }}
    >
      <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">
        <p
          className="font-mono text-[12px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.18em",
          }}
        >
          {d.notfound.eyebrow}
        </p>
        <h1
          className="mt-3 text-[clamp(36px,5vw,52px)] font-semibold leading-[1.05]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          {d.notfound.title}
        </h1>
        <p
          className="mt-4 text-[16px] leading-[1.6]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {d.notfound.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localeHref(lang, "/")}
            className="modern-pill modern-pill--outline"
          >
            {d.notfound.back_retro}
          </Link>
          <Link
            href={localeHref(lang, "/blog")}
            className="modern-pill modern-pill--filled"
          >
            {d.notfound.go_blog}
          </Link>
        </div>
      </div>
    </div>
  );
}
