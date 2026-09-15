import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { buttonClass } from "@/components/ui/Button";
import { footerLegal, opensInNewTab, privacyPage } from "@/content/chrome";
import { privacyBlocks, privacyLastUpdated } from "@/content/sections";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: privacyPage.heading,
  description: privacyPage.intro,
  alternates: { canonical: site.privacyPath },
  openGraph: {
    title: `${privacyPage.heading} — ${site.siteName}`,
    description: privacyPage.intro,
    url: site.privacyPath,
  },
};

/** PAGE-002 / sys_uc_008: the policy's blocks in the order it fixes, then
 *  the same legal sentences the footer carries (block parity, UI_PRIVACY_BLOCKS). */
export default function PrivacyPage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
        <article className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-8">
          <header className="flex max-w-[60ch] flex-col gap-4">
            <p className="text-overline text-accent uppercase">{privacyPage.overline}</p>
            <h1 className="text-heading">{privacyPage.heading}</h1>
            <p className="text-body text-text-muted">{privacyPage.intro}</p>
            <p className="text-caption text-text-subtle">
              {privacyPage.lastUpdatedLabel}{" "}
              <time dateTime={privacyLastUpdated}>{privacyLastUpdated}</time>
            </p>
          </header>

          <div className="flex max-w-prose flex-col gap-8">
            {privacyBlocks.map((block) => (
              <section key={block.id} className="flex flex-col gap-2">
                <h2 className="text-heading-sm">{block.heading}</h2>
                <p className="text-body text-text-muted">{block.body}</p>
              </section>
            ))}
          </div>

          {/* sys_uc_008 parity: the licence sentence reads the same here as in
              SEC-010, because both render `ENT-001`. */}
          <div className="flex flex-col gap-3 border-t border-border pt-8">
            <p className="text-caption text-text-muted">{site.licenseStatement}</p>
            {/* BR-009.2: renders only while the repository's LICENSE resolves. */}
            {site.licenseHref ? (
              <p className="text-caption">
                <a
                  href={site.licenseHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted underline underline-offset-2 hover:text-text"
                >
                  {footerLegal.licenseLabel}
                  <span className="sr-only">{opensInNewTab}</span>
                </a>
              </p>
            ) : null}
            <p className="text-caption text-text-subtle">{site.trademarkDisclaimer}</p>
            <p className="text-caption text-text-subtle">{site.copyrightLine}</p>
            {site.contactEmail ? (
              <p className="text-caption">
                {/* Block 6's removal path, as a `mailto:` and never bare text. */}
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-text-muted underline underline-offset-2 hover:text-text"
                >
                  {privacyPage.contactLabel}
                </a>
              </p>
            ) : null}
            <p>
              <Link href="/" className={buttonClass("secondary", "sm")}>
                {privacyPage.backHomeLabel}
              </Link>
            </p>
          </div>
        </article>
      </main>
      <SiteFooter showProductAnchors={false} />
    </>
  );
}
