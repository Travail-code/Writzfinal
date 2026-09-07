import type { MetadataRoute } from "next";
import { GAMES } from "@/lib/games";

// Official domain of the deployed site.
const BASE_URL = "https://writzzzzzz.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/key`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/status`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  const gamePages: MetadataRoute.Sitemap = GAMES.map((game) => ({
    url: `${BASE_URL}/key/${game.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...gamePages];
}
