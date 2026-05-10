import type { Metadata } from "next";
import { CategoriesIndex } from "@/components/pages/CategoriesIndex";
import { getDictionary } from "@/lib/dict";
import { buildAlternates } from "@/lib/i18n";

const lang = "zh-Hant" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/categories");

export const metadata: Metadata = {
  title: d.categories.title,
  alternates: { canonical: alt.canonical, languages: alt.languages },
};

export default function Page() {
  return <CategoriesIndex lang={lang} />;
}
