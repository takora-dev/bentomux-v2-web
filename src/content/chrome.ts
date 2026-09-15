/* Site chrome — the strings that belong to SEC-001, SEC-010, PAGE-002 and
   PAGE-003 rather than to an entity. Components read them from here, so no
   component holds a literal of its own (`IA XPG-001`, `NFR-006.6`). */

import { navItems } from "./nav";
import { site } from "./site";
import { requireUnique } from "./validate";

export type FooterLink = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
};

export type FooterGroup = {
  readonly id: string;
  readonly heading: string;
  readonly links: readonly FooterLink[];
};

/** SEC-001 — the sticky bar. */
export const headerCopy = {
  skipToContent: "Skip to main content",
  navLabel: "Site",
  openMenuLabel: "Open menu",
  homeLabel: `${site.siteName} — home`,
  logoAlt: "",
} as const;

/** One shared suffix for every destination that leaves the site in a new tab
 *  (FR-007.6). Screen-reader users learn about the new tab before activating. */
export const opensInNewTab = " (opens in a new tab)";

/** The anchor group of SEC-010, shared with the footer's own internal links. */
export const productLinks: readonly FooterLink[] = navItems.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
  external: false,
}));

const projectLinks: readonly FooterLink[] = [
  { id: "repository", label: "Repository", href: site.repositoryUrl, external: true },
  { id: "releases", label: "Latest release", href: site.releasesLatestUrl, external: true },
  /* BR-009.2: rendered only while the repository's LICENSE file exists, so the
     link can never be the one thing on the page that 404s. */
  ...(site.licenseHref
    ? [
        {
          id: "license",
          label: `License (${site.licenseId})`,
          href: site.licenseHref,
          external: true,
        },
      ]
    : []),
];

const supportLinks: readonly FooterLink[] = [
  { id: "issues", label: "Report a bug", href: site.issuesUrl, external: true },
  { id: "discussions", label: "Ask a question", href: site.discussionsUrl, external: true },
];

/** SEC-010 — the columns. `showProductLinks` is false on the secondary routes,
 *  which are not the single-scroll page the anchors point into (XPG-002). */
export function footerGroups(showProductLinks: boolean): readonly FooterGroup[] {
  const groups: FooterGroup[] = [
    { id: "project", heading: "Project", links: projectLinks },
    { id: "support", heading: "Support", links: supportLinks },
  ];
  if (showProductLinks) {
    groups.unshift({ id: "product", heading: "Product", links: productLinks });
  }
  for (const group of groups) {
    requireUnique(group.links, (link) => link.id, `footer.${group.id}.links`);
  }
  return groups;
}

/** SEC-010 — the legal block. The licence sentence is load-bearing and holds
 *  `--color-text-muted`; the rest is fine print (§9.14). */
export const footerLegal = {
  heading: "Site footer",
  privacyLabel: "Privacy",
  contactLabel: `Email ${site.siteName}`,
  telemetry: site.telemetryStatement,
  licenseLabel: `License (${site.licenseId})`,
} as const;

/** PAGE-002 — the page is an expanded rendering of the same blocks. The site
 *  collects nothing, so there is no consent to state and no removal request to
 *  route — the contact address, when configured, is just a way to write in. */
export const privacyPage = {
  overline: "Legal",
  heading: "Privacy",
  intro:
    "Bentomux is a personal open-source project with no analytics and no forms. This page states plainly what this website does with your data: nothing.",
  lastUpdatedLabel: "Last updated",
  contactLabel: `Email ${site.siteName}`,
  backHomeLabel: "Back to the landing page",
} as const;
/** PAGE-003 — one message, two ways out. */
export const notFoundPage = {
  title: "Page not found",
  description: "That page does not exist on the Bentomux site.",
  overline: "404",
  heading: "This page does not exist",
  body: "The address may be mistyped, or the page may have been renamed. The rest of the site is still where you left it.",
  homeLabel: "Back to the landing page",
} as const;
