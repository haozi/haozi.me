import type { Metadata } from "next";
import { PostPage } from "@/components/pages/PostPage";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { siteCore } from "@/lib/site";
import { buildAlternates, ogLocale } from "@/lib/i18n";

const lang = "zh-Hans" as const;

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
  const alt = buildAlternates(`/blog/${slug}`);
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: {
      type: "article",
      locale: ogLocale[lang],
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${siteCore.url}${alt.canonical.replace("/blog", "/zh-Hans/blog")}`,
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updated,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostPage slug={slug} lang={lang} />;
}
