/* StatFact — ENT-015. The four facts in the strip under the hero (IA SEC-011,
   design system §9.8 STAT-001–STAT-003).

   BR-002.3: the strip carries only figures the site can stand behind. Three of
   them are derived from data this repository already owns (the agent roster, the
   licence, the build targets). The fourth — the star count — is the one number
   that lives elsewhere, so it is read from the GitHub API at render time and the
   item is omitted entirely when that read fails, rather than showing a stale or
   invented figure. */

import { agentCounts } from "./agents";
import { site } from "./site";
import { requireCount } from "./validate";

const API = "https://api.github.com/repos/takora-dev/bentomux-v2";

export type StatIcon = "star" | "agents" | "platform" | "license";

export type StatFact = {
  readonly id: string;
  /** Big line. `null` means the fact has no number — the label carries it. */
  readonly value: string;
  readonly label: string;
  readonly icon: StatIcon;
  readonly href: string;
  readonly external: boolean;
};

/** The three facts that need nothing fetched. The star count is inserted by
 *  `statFacts` when the API answers, so the strip is always honest about what
 *  it knows. */
const staticFacts: readonly StatFact[] = [
  {
    id: "runtimes",
    value: String(agentCounts.detected),
    label: "agent CLIs detected",
    icon: "agents",
    href: "#capabilities",
    external: false,
  },
  {
    id: "platforms",
    value: "3",
    label: "platforms · macOS, Linux, Windows",
    icon: "platform",
    href: "#install",
    external: false,
  },
  {
    id: "license",
    value: site.licenseId,
    label: "open source license",
    icon: "license",
    href: site.licenseHref ?? site.repositoryUrl,
    external: true,
  },
] as const;

/** The strip, in order, with the star item only when a real count was read. */
export function statFacts(stars: number | null): readonly StatFact[] {
  if (stars === null) return staticFacts;
  const starFact: StatFact = {
    id: "stars",
    value: stars.toLocaleString("en-US"),
    label: "GitHub stars",
    icon: "star",
    href: site.repositoryUrl,
    external: true,
  };
  return [starFact, ...staticFacts];
}

export async function fetchLatestTag(): Promise<string | null> {
  try {
    const response = await fetch(`${API}/releases/latest`, {
      headers: { accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { tag_name?: unknown };
    return typeof body.tag_name === "string" ? body.tag_name : null;
  } catch {
    return null;
  }
}

/** Reads the star count once an hour. Any failure — offline build, rate limit,
 *  a renamed repository — returns `null`, which drops the item. */
export async function fetchStarCount(): Promise<number | null> {
  try {
    const response = await fetch(API, {
      headers: { accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { stargazers_count?: unknown };
    const stars = body.stargazers_count;
    return typeof stars === "number" && Number.isFinite(stars) ? stars : null;
  } catch {
    return null;
  }
}

requireCount(staticFacts, 3, "staticFacts");

/** The strip's own label. Rendered as a visually hidden heading so the list of
 *  figures is a named region rather than four orphaned numbers. */
export const statStripCopy = {
  heading: "Bentomux at a glance",
} as const;
