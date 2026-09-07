import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Remplace l'ancien `public/robots.txt` : l'URL du sitemap reste
// automatiquement synchronisée avec `SITE_URL`.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
