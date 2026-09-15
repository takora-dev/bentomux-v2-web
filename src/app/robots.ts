import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** §8.4 of the SRS: crawlers get every page. The only endpoint the site had is
   gone with the waitlist, so there is nothing left to disallow. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
