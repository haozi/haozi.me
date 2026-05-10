import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

export function TagPage({ tag, lang }: { tag: string; lang: Locale }) {
  const d = getDictionary(lang);
  const posts = getPostsByTag(tag);
  if (!posts.length) notFound();
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-10">
        <p className="mb-3">
          <Link
            href={localeHref(lang, "/tags")}
            className="text-[14px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent-green)" }}
          >
            {d.tags.all_tags}
          </Link>
        </p>
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          {d.tags.tag_label}
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          #{tag}
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {d.tags.posts_with_tag(posts.length)}
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} lang={lang} />
        ))}
      </div>
    </div>
  );
}
