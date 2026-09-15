import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { buttonClass } from "@/components/ui/Button";
import { navPrimary } from "@/content/nav";
import { notFoundPage, opensInNewTab } from "@/content/chrome";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: notFoundPage.title,
  description: notFoundPage.description,
  robots: { index: false, follow: true },
};

/** PAGE-003 / IA §3.3: one message, two ways out. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center lg:px-10"
      >
        <div className="flex max-w-[60ch] flex-col items-center gap-6">
          <p className="text-overline text-accent uppercase">{notFoundPage.overline}</p>
          <h1 className="text-heading">{notFoundPage.heading}</h1>
          <p className="text-body-lg text-text-muted">{notFoundPage.body}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonClass("primary", "md")}>
              {notFoundPage.homeLabel}
            </Link>
            {/* The 404's second way out is the primary action in the bar, which
                now leaves for the releases — so it is an external link, not a
                route (FR-007.6). */}
            <a
              href={navPrimary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("secondary", "md")}
            >
              {navPrimary.label}
              <span className="sr-only">{opensInNewTab}</span>
            </a>
          </div>
          <p className="text-caption text-text-subtle">{site.copyrightLine}</p>
        </div>
      </main>
      <SiteFooter showProductAnchors={false} />
    </>
  );
}
