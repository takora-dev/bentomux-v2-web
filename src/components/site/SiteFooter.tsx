import Link from "next/link";

import { footerGroups, footerLegal, headerCopy, opensInNewTab } from "@/content/chrome";
import { site } from "@/content/site";

import { cx } from "../ui/cx";
import { Logo } from "./SkipLink";

/** Shared link treatment: quiet by default, full-strength on hover, and never
 *  shorter than a comfortable target. */
const linkClass = cx(
  /* BTN-002: 44px rows below `md`, tighter once the pointer takes over. */
  "inline-flex min-h-11 items-center text-body-sm text-text-muted md:min-h-8",
  "transition-colors duration-instant ease-out hover:text-text",
);

/** The bottom-bar routes out: same target size as the columns, underlined so
 *  they read as controls rather than as another sentence. */
const barLinkClass = cx(linkClass, "underline underline-offset-2");

/**
 * §9.14 / IA XPG-001–XPG-002. The legal block is rendered from `site` so it
 * cannot drift between pages. On the secondary routes the product anchors are
 * omitted (XPG-002) because those pages are not the single-scroll page the
 * anchors point into.
 *
 * Three tiers, so the fine print reads as structure rather than as one wall of
 * grey: the link columns carry the navigation, the legal block carries the
 * load-bearing licence sentence in `--color-text-muted` and the rest in
 * `--color-text-subtle`, and the bottom bar carries the copyright beside the
 * two routes out.
 */
export function SiteFooter({ showProductAnchors = true }: { showProductAnchors?: boolean }) {
  const groups = footerGroups(showProductAnchors);

  return (
    <footer id="footer" className="border-t border-border bg-canvas-raised">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-4 py-14 lg:px-10 lg:py-20">
        <h2 className="sr-only">{footerLegal.heading}</h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <Link
            href="/"
            aria-label={headerCopy.homeLabel}
            className="flex items-center gap-2 self-start rounded-sm"
          >
            <Logo height={24} className="flex items-center" />
            <span className="text-heading-sm font-display font-extrabold">{site.siteName}</span>
          </Link>

          {groups.map((group) => (
            <nav key={group.id} aria-label={group.heading}>
              <h3 className="text-overline text-text-subtle uppercase">{group.heading}</h3>
              <ul className="mt-3 flex flex-col">
                {group.links.map((link) => (
                  <li key={link.id}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                        <span className="sr-only">{opensInNewTab}</span>
                      </a>
                    ) : (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* §9.14: the hairline spans the footer, the prose does not. The
            licence sentence holds `--color-text-muted`; the fine print is
            `--color-text-subtle`. The measure is capped so no line runs the
            full 1200px. */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex max-w-[70ch] flex-col gap-3">
            <p className="text-caption text-text-muted">{site.licenseStatement}</p>
            <p className="text-caption text-text-subtle">{site.trademarkDisclaimer}</p>
            <p className="text-caption text-text-subtle">{footerLegal.telemetry}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-text-subtle">{site.copyrightLine}</p>
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href={site.privacyPath} className={barLinkClass}>
              {footerLegal.privacyLabel}
            </Link>
            {/* BR-007.4: the address is a `mailto:`, never a form and never
                printed as bare text. Absent until one is configured. */}
            {site.contactEmail ? (
              <a href={`mailto:${site.contactEmail}`} className={barLinkClass}>
                {footerLegal.contactLabel}
              </a>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
