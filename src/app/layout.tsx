import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ThemeBootstrap } from "@/components/blog/ThemeBootstrap";
import { Curtain } from "@/components/transition/Curtain";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  authors: [{ name: site.author.name, url: site.author.url }],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.locale} suppressHydrationWarning className={inter.variable}>
      <body className="min-h-dvh">
        <ThemeBootstrap />
        {children}
        <Curtain />
      </body>
    </html>
  );
}
