import type { Metadata } from "next";
import { TagsIndex } from "@/components/pages/TagsIndex";
import { getDictionary } from "@/lib/dict";
import { buildAlternates } from "@/lib/i18n";

const lang = "zh-Hans" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/tags");

export const metadata: Metadata = {
  title: d.tags.title,
  alternates: { canonical: alt.canonical, languages: alt.languages },
};

export default function Page() {
  return <TagsIndex lang={lang} />;
}
