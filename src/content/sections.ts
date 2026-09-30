/* Section copy — the bands of the single-scroll landing page (IA §3.1, revised
   2026-09-15). The page has six bands: the hero, the stat strip, the
   application window figure, the numbered capability rows, the FAQ and the install close.
   Section copy is fixed here and must not be reworded without revising the IA.
   In-page anchors are stable (IA URL-002). */

import { requireUnique, requireCount, requireNonEmpty } from "./validate";

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
  pinLabel: "Pinned to one version",
} as const;

