import type { Metadata } from "next";
import { TagPage } from "@/components/pages/TagPage";
import { getAllTags } from "@/lib/posts";
import { buildAlternates } from "@/lib/i18n";

const lang = "en" as const;

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
  const alt = buildAlternates(`/tags/${tag}`);
  return {
    title: `#${decoded}`,
    alternates: { canonical: alt.canonical, languages: alt.languages },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return <TagPage tag={decodeURIComponent(tag)} lang={lang} />;
}
