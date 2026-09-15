import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** IA URL-001: both indexable routes, both absolute (BR-001.3). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.siteUrl}${site.privacyPath}`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
