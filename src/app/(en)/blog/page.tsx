import type { Metadata } from "next";
import { BlogIndex } from "@/components/pages/BlogIndex";
import { getDictionary } from "@/lib/dict";
import { buildAlternates } from "@/lib/i18n";

const lang = "en" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/blog");

export const metadata: Metadata = {
  title: d.blog.blog,
  description: d.site.description,
  alternates: { canonical: alt.canonical, languages: alt.languages },
};

export default function Page() {
  return <BlogIndex lang={lang} />;
}
