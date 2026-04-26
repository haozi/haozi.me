import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: decoded,
    alternates: { canonical: `/categories/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);
  if (!posts.length) notFound();
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-10">
        <p className="mb-3">
          <Link
            href="/categories"
            className="text-[14px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent-green)" }}
          >
            ← 所有分类
          </Link>
        </p>
        <p
          className="text-[13px] font-semibold uppercase"
          style={{
            color: "var(--color-accent-green)",
            letterSpacing: "0.12em",
          }}
        >
          Category
        </p>
        <h1
          className="mt-2 text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08]"
          style={{
            color: "var(--color-brand-green)",
            letterSpacing: "-0.014em",
          }}
        >
          {decoded}
        </h1>
        <p
          className="mt-3 text-[15px]"
          style={{ color: "var(--color-text-soft)" }}
        >
          {posts.length} 篇文章
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
