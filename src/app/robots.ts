import type { MetadataRoute } from "next";
import { siteCore } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteCore.url}/sitemap.xml`,
    host: siteCore.url,
  };
}
