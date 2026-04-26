import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getPostBySlug,
  getAdjacentPosts,
} from "@/lib/posts";
import { buildToc } from "@/lib/toc";
import { PostMeta } from "@/components/blog/PostMeta";
import { PostBody } from "@/components/blog/PostBody";
import { PostNav } from "@/components/blog/PostNav";
import { Toc } from "@/components/blog/Toc";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updated,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { prev, next } = getAdjacentPosts(slug);
  const tocItems =
    post.frontmatter.toc !== false ? buildToc(post.content) : [];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updated ?? post.frontmatter.date,
    author: { "@type": "Person", name: site.author.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="min-w-0">
        <header className="mb-10">
          <p className="mb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--color-accent-green)" }}
            >
              ← 返回博客
            </Link>
          </p>
          <h1
            className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08]"
            style={{
              color: "var(--color-brand-green)",
              letterSpacing: "-0.014em",
            }}
          >
            {post.frontmatter.title}
          </h1>
          {post.frontmatter.description ? (
            <p
              className="mt-4 text-[18px] leading-[1.6]"
              style={{ color: "var(--color-text)" }}
            >
              {post.frontmatter.description}
            </p>
          ) : null}
          <PostMeta post={post} className="mt-6" />
        </header>

        <div className="prose prose-zinc max-w-none">
          <PostBody source={post.content} />
        </div>

        <PostNav prev={prev} next={next} />
      </div>

      {tocItems.length ? (
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Toc items={tocItems} />
        </aside>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </article>
  );
}
