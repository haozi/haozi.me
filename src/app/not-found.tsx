import Link from "next/link";

export default function NotFound() {
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
          404 · Not Found
        </p>
        <h1
          className="mt-3 text-[clamp(36px,5vw,52px)] font-semibold leading-[1.05]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          页面没找到
        </h1>
        <p
          className="mt-4 text-[16px] leading-[1.6]"
          style={{ color: "var(--color-text-soft)" }}
        >
          这一页可能在某个 PHP warning 后面被吞掉了。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="modern-pill modern-pill--outline">
            ← 回怀旧首页
          </Link>
          <Link href="/blog" className="modern-pill modern-pill--filled">
            去看博客 →
          </Link>
        </div>
      </div>
    </div>
  );
}
