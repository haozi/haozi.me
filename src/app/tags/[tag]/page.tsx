import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    alternates: { canonical: `/tags/${tag}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);
  if (!posts.length) notFound();
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-10">
        <p className="mb-3">
          <Link
            href="/tags"
            className="text-[14px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent-green)" }}
          >
            ← 所有标签
          </Link>
        </p>
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          Tag
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          #{decoded}
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {posts.length} 篇文章带有此标签
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
