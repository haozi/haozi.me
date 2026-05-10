import type { Metadata } from "next";
import { ArchivePage } from "@/components/pages/ArchivePage";
import { getDictionary } from "@/lib/dict";
import { buildAlternates } from "@/lib/i18n";

const lang = "zh-Hant" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/archive");

export const metadata: Metadata = {
  title: d.archive.title,
  alternates: { canonical: alt.canonical, languages: alt.languages },
};

export default function Page() {
  return <ArchivePage lang={lang} />;
}
