import type { Metadata } from "next";
import { RootShell } from "@/components/pages/RootShell";
import { siteCore } from "@/lib/site";
import { getDictionary } from "@/lib/dict";
import { buildAlternates, ogLocale } from "@/lib/i18n";

const lang = "zh-Hant" as const;
const d = getDictionary(lang);
const alt = buildAlternates("/");

export const metadata: Metadata = {
  metadataBase: new URL(siteCore.url),
  title: { default: d.site.title, template: `%s · ${d.site.shortName}` },
  description: d.site.description,
  authors: [{ name: siteCore.author.name, url: siteCore.author.url }],
  alternates: {
    canonical: alt.canonical,
    languages: alt.languages,
    types: { "application/rss+xml": "/zh-Hant/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: ogLocale[lang],
    url: `${siteCore.url}/zh-Hant`,
    siteName: d.site.shortName,
    title: d.site.title,
    description: d.site.description,
  },
  twitter: {
    card: "summary",
    title: d.site.title,
    description: d.site.description,
  },
};

export default function ZhHantRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang={lang}>{children}</RootShell>;
}
