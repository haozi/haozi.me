import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { buildToc } from "@/lib/toc";
import { PostMeta } from "@/components/blog/PostMeta";
import { PostBody } from "@/components/blog/PostBody";
import { PostNav } from "@/components/blog/PostNav";
import { Toc } from "@/components/blog/Toc";
import { siteCore } from "@/lib/site";
import { getDictionary } from "@/lib/dict";
import { type Locale, localeHref } from "@/lib/i18n";

export function PostPage({ slug, lang }: { slug: string; lang: Locale }) {
  const d = getDictionary(lang);
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
    author: { "@type": "Person", name: siteCore.author.name },
    mainEntityOfPage: `${siteCore.url}${localeHref(lang, `/blog/${post.slug}`)}`,
    inLanguage: lang,
  };

  return (
    <article className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="min-w-0">
        <header className="mb-10">
          <p className="mb-4">
            <Link
              href={localeHref(lang, "/blog")}
              className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--color-accent-green)" }}
            >
              {d.post.back_to_blog}
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
          <PostMeta post={post} lang={lang} className="mt-6" />
        </header>

        <div className="prose prose-zinc max-w-none">
          <PostBody source={post.content} />
        </div>

        <PostNav prev={prev} next={next} lang={lang} />
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
