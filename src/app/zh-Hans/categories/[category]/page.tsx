import type { Metadata } from "next";
import { CategoryPage } from "@/components/pages/CategoryPage";
import { getAllCategories } from "@/lib/posts";
import { buildAlternates } from "@/lib/i18n";

const lang = "zh-Hans" as const;

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
  const alt = buildAlternates(`/categories/${category}`);
  return {
    title: decoded,
    alternates: { canonical: alt.canonical, languages: alt.languages },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryPage category={decodeURIComponent(category)} lang={lang} />;
}
