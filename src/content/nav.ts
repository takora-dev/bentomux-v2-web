/* NavItem — ENT-009. One list shared by the navigation bar and the footer's
   product group, so the two cannot drift (FR-001.3, FR-001.6).

   The bar is deliberately short (IA §4.1, revised 2026-09-15): the page holds
   five bands, and a link for each of them would be a table of contents rather
   than a menu. `Install` carries the one in-page destination that matters, and
   the primary action goes straight to the published releases — the waitlist it
   used to point at went with the waitlist band. */

import { site } from "./site";
import { anchors } from "./sections";
import { requireUnique } from "./validate";

export type NavKind = "anchor" | "external" | "action";

export type NavItem = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly kind: NavKind;
};

export const navItems: readonly NavItem[] = [
  { id: "docs", label: "Docs", href: "/docs", kind: "external" },
  { id: "compare", label: "Compare", href: "/compare", kind: "external" },
] as const;

export const navExternal: NavItem = {
  id: "github",
  label: "GitHub",
  href: site.repositoryUrl,
  kind: "external",
};

export const navPrimary: NavItem = {
  id: "install",
  label: "Install",
  href: "#install",
  kind: "anchor",
};

requireUnique(navItems, (item) => item.id, "navItems");
