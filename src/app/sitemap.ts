import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** IA URL-001: every indexable route, all absolute (BR-001.3). The legal
 *  statements live in the footer (SEC-010), so the site has no policy page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.siteUrl}/docs`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.siteUrl}/plugins`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${site.siteUrl}/compare`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
