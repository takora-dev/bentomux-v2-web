/* Section copy — the bands of the single-scroll landing page (IA §3.1, revised
   2026-09-15). The page is deliberately five bands: the hero, the stat strip, the
   application window figure, the numbered capability rows and the install close.
   Section copy is fixed here and must not be reworded without revising the IA.
   In-page anchors are stable (IA URL-002). */

import { requireUnique, requireCount, requireNonEmpty, invariant } from "./validate";

export type SectionId = "hero" | "capabilities" | "install";

export type SectionCopy = {
  readonly id: SectionId;
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro?: string;
};

export const sections: readonly SectionCopy[] = [
  {
    id: "capabilities",
    eyebrow: "Capabilities",
    /* Rendered as the section's accessible name and visually hidden: the five
       rows are the whole band, and a heading above them only repeats row 01
       (design system §9.6). */
    heading: "What the window does that a terminal tab does not",
  },
  {
    id: "install",
    eyebrow: "Install",
    heading: "Install Bentomux on your machine",
    intro:
      "These commands install the latest release. They cover macOS, Linux and Windows, and they are the maintainers' own installer scripts, quoted unchanged.",
  },
] as const;

requireCount(sections, 2, "sections");
requireUnique(sections, (section) => section.id, "sections");
for (const section of sections) requireNonEmpty(section.heading, `sections.${section.id}.heading`);

/** Anchor of every anchored region, in page order. The two bands with copy in
 *  this module are joined by the hero, the figure band and the footer, which
 *  render their own ids; the navigation labels live in `nav.ts`. */
export const anchors = {
  hero: "hero",
  capabilities: "capabilities",
  install: "install",
  footer: "footer",
} as const;
/* SEC-006 section-level statements (data model keeps ≤ 3 notes per panel).
   The manual-download wording is composed in the section from
   `manualDownloads` in install.ts, so the format list has one source. */
export const installExtras = {
  linuxArchNote:
    "Linux builds are published for x86_64 only. There is no aarch64 Linux build yet.",
  pinLabel: "Pinned to one version",
} as const;

/* PAGE-002 content blocks — sys_uc_008's content contract, in its order. The
   site takes nothing from the visitor, so the policy states that and nothing
   else; the blocks that described the waitlist form's email handling went with
   the form. */
export const privacyLastUpdated = "2026-09-15";

export type PrivacyBlock = { readonly id: string; readonly heading: string; readonly body: string };

export const privacyBlocks: readonly PrivacyBlock[] = [
  {
    id: "scope",
    heading: "Controller and scope",
    body: "This policy covers this website. It does not cover the desktop application, which collects nothing, or the agents you run alongside it, which are governed by their own vendors' policies.",
  },
  {
    id: "collected",
    heading: "What is collected",
    body: "Nothing. This website has no form, no account and no email list. Nothing you do here is recorded about you.",
  },
  {
    id: "not-collected",
    heading: "What is not collected",
    body: "No account, no name, no email address, no analytics, no advertising identifier, no cookie, nothing written to local storage, no session replay, and no third-party script.",
  },
  {
    id: "changes",
    heading: "Changes to the policy",
    body: `This version took effect on ${privacyLastUpdated}. There is no CMS: a change to this text is a commit in the repository, so the history of the policy is public.`,
  },
] as const;

invariant(privacyBlocks.length === 4, "privacyBlocks must hold the four blocks the site's own policy needs");
requireUnique(privacyBlocks, (block) => block.id, "privacyBlocks");
