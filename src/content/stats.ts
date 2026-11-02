/* StatFact — ENT-015. The four facts in the strip under the hero (IA SEC-011,
   design system §9.8 STAT-001–STAT-003).

   BR-002.3: the strip carries only figures the site can stand behind. Two of
   them are derived from data this repository already owns (the agent roster, the
   build targets). The other two — the star count and the installer download total
   — live elsewhere, so they are read from the GitHub API at render time and each
   item is omitted entirely when its read fails, rather than showing a stale or
   invented figure. The download total counts installer artefacts only, because
   the updater artefacts every release also carries are update traffic rather than
   installs. */

import { agentCounts } from "./agents";
import { site } from "./site";
import { requireCount } from "./validate";

const API = "https://api.github.com/repos/takora-dev/bentomux-v2";

/** The artefact kinds a person installs from. The bundler's own updater assets
 *  (`.app.tar.gz`, `latest.json`, `updater.json`, `sha256sums.txt`) must stay
 *  out — see `fetchInstallerDownloadCount`. */
const INSTALLER_ASSET = /\.(dmg|exe|msi|deb|rpm)$|AppImage$/i;

export type StatIcon = "star" | "agents" | "platform" | "download";

export type StatFact = {
  readonly id: string;
  /** Big line. `null` means the fact has no number — the label carries it. */
  readonly value: string;
  readonly label: string;
  readonly icon: StatIcon;
  readonly href: string;
  readonly external: boolean;
};

/** The two facts that need nothing fetched. The star count and the download
 *  total are inserted by `statFacts` when the API answers, so the strip is always
 *  honest about what it knows. */
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
] as const;

/** The strip, in order, with the fetched items only when a real count was read. */
export function statFacts(stars: number | null, installs: number | null): readonly StatFact[] {
  const fetched: StatFact[] = [];
  if (stars !== null) {
    fetched.push({
      id: "stars",
      value: stars.toLocaleString("en-US"),
      label: "GitHub stars",
      icon: "star",
      href: site.repositoryUrl,
      external: true,
    });
  }
  if (installs !== null) {
    fetched.push({
      id: "downloads",
      value: installs.toLocaleString("en-US"),
      label: "installer downloads · GitHub releases",
      icon: "download",
      href: `${site.repositoryUrl}/releases`,
      external: true,
    });
  }
  return [...fetched, ...staticFacts];
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

/** Sums `download_count` across the installer artefacts only — the `.dmg`,
 *  `.exe`, `.msi`, `.deb`, `.rpm` and `.AppImage` a person actually installs
 *  from. The updater artefacts each release also carries (`latest.json`,
 *  `updater.json`, `sha256sums.txt`, `Bentomux.app.tar.gz`) are auto-update
 *  traffic, not installs, and on this repository they outweigh the installers
 *  roughly three to one, so counting them would claim a figure the data does not
 *  support. Failure returns `null` and drops the item, same as the star count. */
export async function fetchInstallerDownloadCount(): Promise<number | null> {
  // ponytail: five pages of 100 releases is the cap; page deeper if Bentomux ever
  // ships more than 500 releases.
  try {
    let total = 0;
    for (let page = 1; page <= 5; page += 1) {
      const response = await fetch(`${API}/releases?per_page=100&page=${page}`, {
        headers: { accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      });
      if (!response.ok) return null;
      const body: unknown = await response.json();
      if (!Array.isArray(body)) return null;
      for (const release of body as { assets?: unknown }[]) {
        if (!Array.isArray(release.assets)) continue;
        for (const asset of release.assets as { name?: unknown; download_count?: unknown }[]) {
          if (typeof asset.name !== "string" || !INSTALLER_ASSET.test(asset.name)) continue;
          const count = asset.download_count;
          if (typeof count === "number" && Number.isFinite(count)) total += count;
        }
      }
      if (body.length < 100) break;
    }
    return total;
  } catch {
    return null;
  }
}

requireCount(staticFacts, 2, "staticFacts");

/** The strip's own label. Rendered as a visually hidden heading so the list of
 *  figures is a named region rather than four orphaned numbers. */
export const statStripCopy = {
  heading: "Bentomux at a glance",
} as const;
