/* The figure band's copy (IA FIG-001, design system §10.3).

   The band shows a real capture of the application window rather than a drawing
   of it, so the strings below name what the capture shows. `alt` repeats the
   states visible in it, because the image is content and not decoration
   (IMG-003). The band's own labels sit above and below the frame. */

import { requireNonEmpty } from "./validate";

export const screenshotCopy = {
  bandHeading: "screenshot",
  /** Above the frame, beside the label. */
  bandHint: "the window, with a workspace waiting on your approval",
  /** The capture's own facts: same three workspaces the caption names. */
  alt: "The Bentomux window showing three workspaces — bentomux-v2, website and scratch — with an approval prompt raised over the website workspace.",
  caption: "Three workspaces, one of them waiting on your approval.",
} as const;

for (const [key, value] of Object.entries(screenshotCopy)) {
  requireNonEmpty(value, `screenshotCopy.${key}`);
}
