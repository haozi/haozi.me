import type { Metadata } from "next";
import { RetroHome } from "@/components/pages/RetroHome";
import { getDictionary } from "@/lib/dict";
import { buildAlternates } from "@/lib/i18n";

const lang = "en" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/");

export const metadata: Metadata = {
  title: d.site.title,
  alternates: { canonical: alt.canonical, languages: alt.languages },
};

export default function Page() {
  return <RetroHome lang={lang} />;
}
