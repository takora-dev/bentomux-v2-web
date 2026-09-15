/* SiteConfig — ENT-001. Single definition site for site-level facts.
   Every absolute URL derives from NEXT_PUBLIC_SITE_URL (BR-001.3, CON-005);
   a missing value in a production build fails the build (NFR-004.2). */

import { invariant } from "./validate";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    invariant(
      raw.startsWith("http://") || raw.startsWith("https://"),
      "NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL",
    );
    return raw.replace(/\/+$/, "");
  }
  invariant(
    process.env.NODE_ENV !== "production",
    "NEXT_PUBLIC_SITE_URL is required in a production build (NFR-004.2)",
  );
  return "http://localhost:3000";
}

const REPOSITORY_URL = "https://github.com/takora-dev/bentomux-v2";

/* ENT-001.contactEmail. No address exists anywhere in either repository, so it is
   read from the environment: inventing one would be worse than leaving the
   `mailto:` links out (`FR-007.5`, `BR-007.4`). Set NEXT_PUBLIC_CONTACT_EMAIL
   and the footer and the privacy page appear. */
function resolveContactEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (!raw) return null;
  invariant(raw.includes("@"), "NEXT_PUBLIC_CONTACT_EMAIL must look like an address");
  return raw;
}

const contactEmail = resolveContactEmail();

/* CON-008 / BR-009.1: the repository carries an MIT `LICENSE` (commit af49991,
   tracked on master), so the licence is stated plainly and a licence link may
   render. Setting this to false restores the BR-009.2 deferred wording and
   suppresses the link at every render site, in one commit. */
const licenseFilePublished = true;

export const site = {
  siteUrl: resolveSiteUrl(),
  siteName: "Bentomux",
  titleTemplate: "%s — Bentomux",
  defaultTitle: "Bentomux — run every coding agent in one window",
  defaultDescription:
    "Bentomux is a calm desktop app for running coding agents side by side: project workspaces, persistent split-pane terminals, live agent state and approvals.",
  repositoryUrl: REPOSITORY_URL,
  releasesLatestUrl: `${REPOSITORY_URL}/releases/latest`,
  issuesUrl: `${REPOSITORY_URL}/issues`,
  discussionsUrl: `${REPOSITORY_URL}/discussions`,
  /* Used by the structured-data block only (NFR-008.3). */
  operatingSystems: "macOS, Linux, Windows",
  privacyPath: "/privacy",
  contactEmail,
  licenseId: "MIT",
  licenseStatement: licenseFilePublished
    ? "Bentomux is free and open source software, released under the MIT license."
    : "Open source — the license is being finalised and will be published with the first release.",
  /* A licence link may only render while it resolves (BR-009.2); the deferred
     wording and the missing link travel together. */
  licenseHref: licenseFilePublished ? `${REPOSITORY_URL}/blob/master/LICENSE` : null,
  trademarkDisclaimer:
    "All product names, logos, and brands are property of their respective owners. Use of these names does not imply endorsement.",
  telemetryStatement:
    "The desktop application collects no telemetry. It sends nothing anywhere unless you enable the remote monitor.",
  copyrightLine: `© ${new Date().getFullYear()} Bentomux — a personal open-source project.`,
} as const;

/* Hero copy — IA §5.3 budgets: headline 3–7 words, subheadline ≤ 30 words.

   The hero is built the way the band reads (IA SEC-002): a status ribbon,
   an eyebrow, the headline, one paragraph, the install command, and a meta line
   that names where else the app installs. `headlineEmphasis` is the phrase the
   hero sets in the accent colour — the words stay in `headline`, so the social
   card and the page cannot disagree about the sentence. */
export const hero = {
  /* FR-001.4 / sys_uc_001 step 2: the hero itself names the product, so the
     name is text in the first viewport and not only a wordmark in the bar
     (IMG-003: no image stands in for text). */
  badge: "Bentomux — beta out now",
  eyebrow: "the window for coding agents",
  headline: "Run every coding agent in one window",
  headlineEmphasis: "one window",
  subheadline:
    "Bentomux is one native window for project workspaces, persistent split-pane terminals, live agent state and approval handling instead of a scatter of terminal tabs.",
  /** The command the hero quotes. Its text comes from ENT-005 by id, so the
   *  hero and the install band can never quote different scripts (BR-005.1). */
  quickStartCommandId: "macos-install",
  /** Sits under the command: what the command is, and where the rest of the
   *  platforms live. The platform names are derived from ENT-010. */
  quickStartNote: "installs the .app bundle other platforms below",
} as const;

export const logo = {
  /* 1024-wide source: the hero renders the mark at up to 480 CSS px, so the
     raster has to clear 2× that on a retina screen — the 504 px export did
     not, and the mark read soft. One source serves the header, the hero and
     the favicon (`docs/design_system.md` §10.2). */
  src: "/bentomux.png",
  width: 1024,
  height: 1035,
  alt: "Bentomux logo",
} as const;
