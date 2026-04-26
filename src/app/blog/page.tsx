import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: site.description,
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 10);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      {/* hero */}
      <section className="mb-14">
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          Welcome — now in 2026
        </p>
        <h1
          className="mt-3 text-[clamp(36px,6vw,58px)] font-semibold leading-[1.05]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          慢慢写，慢慢读。
        </h1>
        <p
          className="mt-4 max-w-[640px] text-[17px] leading-[1.65]"
          style={{ color: "var(--color-text)" }}
        >
          {site.description}
        </p>

        {tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="modern-chip"
              >
                {tag}
                <span className="opacity-60">· {count}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {/* featured post — full-width card */}
      {featured ? (
        <section className="mb-12">
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {/* post grid */}
      {rest.length > 0 ? (
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              className="text-[24px] font-semibold"
              style={{
                color: "var(--color-text)",
                letterSpacing: "-0.012em",
              }}
            >
              All posts
            </h2>
            <Link
              href="/archive"
              className="text-[14px] font-semibold hover:underline"
              style={{ color: "var(--color-accent-green)" }}
            >
              Archive →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function FeaturedPost({ post }: { post: ReturnType<typeof getAllPosts>[number] }) {
  const { slug, frontmatter, readingTimeMinutes } = post;
  return (
    <Link
      href={`/blog/${slug}`}
      className="modern-card group block overflow-hidden"
    >
      <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
        <div className="p-8 md:p-10">
          <p
            className="mb-3 text-[12px] font-semibold uppercase"
            style={{
              color: "var(--color-accent-green)",
              letterSpacing: "0.12em",
            }}
          >
            {frontmatter.category ?? "Featured"}
          </p>
          <h3
            className="text-[clamp(24px,3.4vw,34px)] font-semibold leading-[1.15] transition-colors group-hover:text-[color:var(--color-accent-green)]"
            style={{
              color: "var(--color-brand-green)",
              letterSpacing: "-0.014em",
            }}
          >
            {frontmatter.title}
          </h3>
          {frontmatter.description ? (
            <p
              className="mt-4 text-[16px] leading-[1.65]"
              style={{ color: "var(--color-text)" }}
            >
              {frontmatter.description}
            </p>
          ) : null}
          <p
            className="mt-6 text-[13px]"
            style={{
              color: "var(--color-text-soft)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="mx-2 opacity-50">·</span>
            {readingTimeMinutes} min read
          </p>
          <span
            className="modern-pill modern-pill--filled mt-6 inline-flex"
            aria-hidden="true"
          >
            Read article →
          </span>
        </div>
        <div
          className="relative hidden md:block"
          style={{ background: "var(--color-house-green)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <p
              className="text-[clamp(20px,2.6vw,28px)] font-semibold leading-[1.25]"
              style={{
                color: "var(--color-text-on-dark)",
                letterSpacing: "-0.012em",
              }}
            >
              <span style={{ color: "var(--color-gold)" }}>“</span>
              {frontmatter.description?.slice(0, 110) ??
                frontmatter.title}
              <span style={{ color: "var(--color-gold)" }}>”</span>
            </p>
          </div>
          <div
            className="absolute inset-x-10 bottom-10 h-px"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
          <p
            className="absolute bottom-5 left-10 right-10 text-[12px] font-semibold uppercase"
            style={{
              color: "var(--color-text-on-dark-soft)",
              letterSpacing: "0.12em",
            }}
          >
            haozi.me · featured
          </p>
        </div>
      </div>
    </Link>
  );
}
