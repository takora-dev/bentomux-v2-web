/* Plugin marketplace — ENT-016 and the /plugins route copy.

   Discovery rule, order and paging are owned by the desktop application
   (`docs/PLUGIN_MARKETPLACE.md`, `src/shared/marketplace.ts` in
   takora-dev/bentomux-v2). This module repeats the *rules* so the website and
   the app cannot describe the same catalog two different ways, and it reads the
   catalog from GitHub at build time rather than in the visitor's browser.

   Why build time: unauthenticated GitHub allows 60 core requests an hour and 10
   search requests a minute, per IP. The app spends 1 search + 1 release call per
   repo and caches for six hours; a page that fetched per visitor would spend the
   visitor's own budget and show a rate-limit error instead of a list. The build
   fetches once and the result is prerendered.

   What this module will not do: invent a number. When GitHub cannot be reached
   the catalog is empty and `live` is false, and the page says so and links to
   the topic search. A fabricated star count would be worse than an absent one
   (same rule as `stats.ts` for the star item). */

import { invariant, requireUnique } from "./validate";

/** The topic a repo must carry to be discoverable. Owned by the app
 *  (`marketplace.rs` `TOPIC`); repeated here because the website cannot import
 *  Rust. */
export const TOPIC = "bentomux-plugin";

/** Repos pulled per sweep. Matches `MAX_REPOS` in the app so the website and the
 *  app show the same list rather than two different truncations of it. */
export const MAX_REPOS = 30;

/** Rows per page. Matches `PAGE_SIZE` in `src/shared/marketplace.ts`. */
export const PAGE_SIZE = 10;

/** Six hours, matching `CACHE_TTL_MILLIS` in the app. */
const REVALIDATE_SECONDS = 6 * 60 * 60;

const API = "https://api.github.com";

/* `URL-001` says no absolute URL is written literally, and it means the *site's*
   URLs — those all derive from `NEXT_PUBLIC_SITE_URL`. A third-party host is a
   different thing: `stats.ts` already writes `https://api.github.com` for the
   star count, and these two are the same kind of literal. */
const GITHUB = "https://github.com";

/** One row of the browsing list. Field names mirror `MarketplacePlugin` in
 *  `marketplace.rs`, minus the install-state fields (`installed`,
 *  `installedVersion`, `updateAvailable`) — a website cannot know what is
 *  installed on the visitor's machine, so it must not pretend to. */
export type PluginListing = {
  readonly repo: string;
  readonly name: string;
  readonly description: string | null;
  readonly stars: number;
  readonly downloads: number;
  /** Release tag, e.g. `v1.6.0`. Empty when there is no release. */
  readonly version: string;
  readonly publishedAt: string | null;
  /** Release URL when there is a release, otherwise the repo URL. */
  readonly htmlUrl: string;
  readonly assetName: string;
  /** False when the release is missing, ambiguous, or has no digest. */
  readonly installable: boolean;
  /** Why `installable` is false; empty when it is true. */
  readonly note: string;
};

export type Catalog = {
  readonly plugins: readonly PluginListing[];
  /** True only when GitHub answered the search this build. */
  readonly live: boolean;
  /** Why the sweep is empty or degraded; empty when it is neither. */
  readonly note: string;
};

/* ---------------------------------------------------------------- fetching */

type SearchItem = {
  full_name?: unknown;
  name?: unknown;
  description?: unknown;
  stargazers_count?: unknown;
  html_url?: unknown;
  archived?: unknown;
  fork?: unknown;
};

type ReleaseAsset = {
  name?: unknown;
  size?: unknown;
  download_count?: unknown;
  browser_download_url?: unknown;
  digest?: unknown;
};

type Release = {
  tag_name?: unknown;
  published_at?: unknown;
  html_url?: unknown;
  assets?: unknown;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

/**
 * Turn a release into the install facts the list shows.
 *
 * The rules are the app's, restated: exactly one `.zip` asset, and a
 * `sha256:` digest GitHub published at upload. Zero assets, two assets, or a
 * missing digest all make the row non-installable with a note saying which —
 * `merge()` in `marketplace.rs` is the source of these sentences.
 */
function fromRelease(release: Release | null): Pick<
  PluginListing,
  "version" | "publishedAt" | "assetName" | "downloads" | "installable" | "note"
> {
  if (!release) {
    return {
      version: "",
      publishedAt: null,
      assetName: "",
      downloads: 0,
      installable: false,
      note: "No published release yet.",
    };
  }

  const tag = str(release.tag_name) ?? "";
  const publishedAt = str(release.published_at);
  const assets = Array.isArray(release.assets) ? (release.assets as ReleaseAsset[]) : [];
  const zips = assets.filter((asset) => (str(asset.name) ?? "").toLowerCase().endsWith(".zip"));

  const base = { version: tag, publishedAt, assetName: "", downloads: 0 };

  if (zips.length === 0) {
    return {
      ...base,
      installable: false,
      note: `Release ${tag} has no .zip asset. Publish one with \`gh release create\`.`,
    };
  }
  if (zips.length > 1) {
    return {
      ...base,
      installable: false,
      note: `Release ${tag} has ${zips.length} .zip assets. Expected exactly one.`,
    };
  }

  const asset = zips[0];
  const digest = str(asset.digest)?.trim() ?? "";
  const withAsset = {
    ...base,
    assetName: str(asset.name) ?? "",
    downloads: num(asset.download_count),
  };

  if (!digest) {
    return {
      ...withAsset,
      installable: false,
      note: "This asset predates GitHub's release digests and cannot be verified. Re-upload it as a new release.",
    };
  }
  if (!digest.startsWith("sha256:")) {
    return {
      ...withAsset,
      installable: false,
      note: "GitHub published no sha256 digest for this asset, so it cannot be verified. Re-upload it as a new release.",
    };
  }
  return { ...withAsset, installable: true, note: "" };
}

/** Most-starred first, repo name as the tie-break — `by_stars()` in the app.
 *  The tie-break is load-bearing once the list paginates: two tied rows
 *  swapping places between builds would put one plugin on two pages. */
function byStars(a: PluginListing, b: PluginListing): number {
  return b.stars - a.stars || a.repo.toLowerCase().localeCompare(b.repo.toLowerCase());
}

/**
 * Read the catalog from GitHub. Never throws: a failure is an empty catalog
 * with a reason, so a GitHub outage degrades the page instead of failing the
 * build.
 */
export async function fetchCatalog(): Promise<Catalog> {
  /* A build-time escape hatch for exercising the pager and the empty state
     without inventing rows in the shipped code: `PLUGINS_FIXTURE=many|empty`
     swaps the network read for a deterministic list. Unset in every real build,
     so the only path that ever runs in production is the `getJson` call below
     it. */
  const fixture = process.env.PLUGINS_FIXTURE;
  const search =
    fixture === "empty"
      ? null
      : fixture === "many"
        ? { items: Array.from({ length: 23 }, (_, i) => ({
            full_name: `fixture/plugin-${String(i + 1).padStart(2, "0")}`,
            name: `plugin-${String(i + 1).padStart(2, "0")}`,
            description: i % 2 ? null : `Fixture plugin number ${i + 1}.`,
            stargazers_count: 100 - i,
            html_url: `${GITHUB}/fixture/plugin-${String(i + 1).padStart(2, "0")}`,
            archived: false,
            fork: false,
          })) }
        : await getJson(
            `${API}/search/repositories?q=topic:${TOPIC}&sort=stars&order=desc&per_page=${MAX_REPOS}`,
          );

  const items = isRecord(search) && Array.isArray(search.items) ? search.items : null;
  if (!items) {
    return {
      plugins: [],
      live: false,
      note: "GitHub did not answer this build, so the catalog is empty rather than stale. The live topic search above is the real list.",
    };
  }

  /* A fork or an archived repo is not something to install; the app drops them
     too, and the two lists should agree about what is in the marketplace. */
  const repos = (items as SearchItem[])
    .filter((item) => item.archived !== true && item.fork !== true)
    .slice(0, MAX_REPOS);

  const plugins = await Promise.all(
    repos.map(async (item): Promise<PluginListing | null> => {
      const repo = str(item.full_name);
      if (!repo) return null;
      const release = (await getJson(`${API}/repos/${repo}/releases/latest`)) as Release | null;
      const install = fromRelease(isRecord(release) ? release : null);
      return {
        repo,
        /* The list shows the repo's own name and description, not the
           manifest's: the real manifest is only read out of the downloaded
           archive at install time (`PLUGIN_MARKETPLACE.md` §"What a reader
           sees"). A repo can lie here and gain nothing. */
        name: str(item.name) ?? repo,
        description: str(item.description),
        stars: num(item.stargazers_count),
        htmlUrl: str(item.html_url) ?? `${GITHUB}/${repo}`,
        ...install,
      };
    }),
  );

  const catalog = plugins.filter((plugin): plugin is PluginListing => plugin !== null).sort(byStars);

  return {
    plugins: catalog,
    live: true,
    note: catalog.length
      ? ""
      : "No repository carries the topic yet. The first one to publish a release appears here.",
  };
}

/* -------------------------------------------------- search and paging (pure) */

/** The fields a person would plausibly type into a search box. */
export type Searchable = {
  readonly name: string;
  readonly description?: string | null;
  readonly repo: string;
};

/** Case-insensitive match over name, description and owner/repo — the app's
 *  `filterPlugins`. Runs over the list already in memory rather than issuing a
 *  second GitHub search. */
export function filterPlugins<T extends Searchable>(plugins: readonly T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...plugins];
  return plugins.filter((plugin) =>
    [plugin.name, plugin.description ?? "", plugin.repo].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}

export type Page<T> = {
  readonly items: T[];
  /** Zero-based and always in range: an out-of-range request is clamped, so a
   *  shrinking result set can never strand the view on a blank page. */
  readonly page: number;
  /** At least 1, so "Page 1 of 1" reads correctly for an empty catalog. */
  readonly pages: number;
  readonly total: number;
};

/** The app's `paginate`, same clamping rules. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number = PAGE_SIZE): Page<T> {
  const per = Math.max(1, pageSize);
  const pages = Math.max(1, Math.ceil(items.length / per));
  const safe = Math.min(Math.max(0, page), pages - 1);
  return {
    items: items.slice(safe * per, safe * per + per),
    page: safe,
    pages,
    total: items.length,
  };
}

/* --------------------------------------------------------------------- copy */

/** The rule the app enforces, quoted on the page: the tag and the manifest
 *  version must agree (`PLUGIN_MARKETPLACE.md` §7). */
export const tagRule = {
  label: "Tag = manifest version",
  body: "The tag is stripped of one leading `v` and parsed as semver, then compared against the installed manifest version. A repo tagged `v1.1.0` whose manifest still says `1.0.0` keeps offering the same update forever.",
} as const;

export const pluginsPage = {
  eyebrow: "Plugins",
  heading: "Plugins, built by the herd",
  intro:
    "A Bentomux plugin is a folder of JavaScript that adds buttons, panels, tabs, modals and background services to the app. Every repository carrying the GitHub topic below is listed here, most-starred first.",
  /* The same caution the app's own review screen carries: a listing is
     discovery, not vetting. */
  caution:
    "Listings are not reviewed. A plugin runs in the app's own context, so permissions are a declared contract rather than a sandbox — review what you install the way you would review a shell alias.",
  cautionHref: "/docs/plugins",
  cautionLabel: "How plugins and permissions work",
} as const;

export const catalogCopy = {
  heading: "Browse the catalog",
  subheading: "the full index — search it, then install from the app",
  searchLabel: "Search plugins",
  searchPlaceholder: "Search plugins, repositories, owners…",
  emptyCatalog: "No plugins published yet.",
  noMatch: (query: string) => `Nothing matches “${query}”.`,
  clear: "Clear search",
  previous: "‹ Previous",
  next: "Next ›",
  pageOf: (page: number, pages: number) => `Page ${page} of ${pages}`,
  inCatalog: (count: number) => `${count} in catalog`,
  stars: "GitHub stars for this repository",
  downloads: "Downloads of this release asset on GitHub",
  notInstallable: "Not installable",
  installNote: "Install from Plugin Studio",
} as const;

export type GuidanceStep = {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly command?: string;
};

/** Install guidance. The command is the app's own affordance, quoted because a
 *  website cannot install anything — there is no download button here on
 *  purpose. */
export const installSteps: readonly GuidanceStep[] = [
  {
    n: "01",
    title: "Open Plugin Studio",
    body: "The catalog lives in the app, not on this page. This site lists what is published; the app is what downloads, verifies and installs it.",
    command: "Bentomux → Plugin Studio → Browse marketplace…",
  },
  {
    n: "02",
    title: "Install from the row",
    body: "Each row shows the repo, its star count, the release tag and the asset download count. Installing downloads the release asset and checks it against the sha256 GitHub published at upload.",
    command: "owner/your-plugin  ★ 314   ↓ 1.2k   →  Install",
  },
  {
    n: "03",
    title: "Read the review screen",
    body: "The real plugin.json is read out of the downloaded archive and shown before anything runs: its id, its name, the permissions it asks for and the hosts it may reach. Nothing runs until you confirm.",
  },
  {
    n: "04",
    title: "Updates keep one rollback",
    body: "A row offers an update only when the release tag is strictly newer than the installed manifest version. The previous version is kept on disk, and Roll back appears in Settings → Plugins.",
  },
] as const;

/** Publish guidance. Topic *and* release are both required — the topic alone
 *  makes a repo discoverable but not installable. */
export const publishSteps: readonly GuidanceStep[] = [
  {
    n: "01",
    title: "Push a public repo",
    body: "A folder holding plugin.json and an ES module entry. Start from one of the seven templates that ship with the app.",
    command: "cp -r resources/plugin-templates/basic ~/acme-habit-tracker",
  },
  {
    n: "02",
    title: "Add the topic",
    body: `Add ${TOPIC} to the repo's topics. That is the entire registration step — there is nothing to submit and nobody to approve. Topics take a few minutes to index.`,
    command: `gh repo edit --add-topic ${TOPIC}`,
  },
  {
    n: "03",
    title: "Validate before you ship",
    body: "The validator checks the manifest, the id namespace, the entry file, the contribution ids, the permissions and the network origins without running any of your code.",
    command: "bentomux --plugin-validate ~/acme-habit-tracker --json",
  },
  {
    n: "04",
    title: "Publish a release with one .zip",
    body: "The plugin files must sit at the root of the zip — not inside a wrapper directory, which is why the auto-generated source tarball will not do. Exactly one .zip asset; zero is not installable and two is ambiguous.",
    command: "gh release create v1.0.0 ../acme-habit-tracker-1.0.0.zip",
  },
] as const;

/** Honest limits, stated on the page rather than discovered. */
export const catalogLimits = {
  heading: "What the numbers are, and are not",
  rows: [
    {
      id: "stars",
      label: "★ stars",
      body: "GitHub's star count for the repository, surfaced as-is. Not an endorsement by Bentomux.",
    },
    {
      id: "downloads",
      label: "↓ downloads",
      body: "Downloads of that one release asset — including downloads that were never installed by Bentomux.",
    },
    {
      id: "version",
      label: "version",
      body: "The release tag. The manifest version inside the archive is what the app actually compares, and it is read after download.",
    },
    {
      id: "order",
      label: "order",
      body: "One order, and it is the only one offered: most stars first, with the repository name breaking a tie. The app implements no other sort, so none is described here.",
    },
  ],
} as const;

/** The destinations this page points at. The topic search is the live list, so
 *  the page has somewhere honest to send a visitor when the build's copy is
 *  empty. */
export const pluginLinks = {
  topicSearch: `${GITHUB}/search?q=topic%3A${TOPIC}&type=repositories`,
  topic: TOPIC,
} as const;

/* ------------------------------------------------------------------ checks */

requireUnique(installSteps, (step) => step.n, "installSteps");
requireUnique(publishSteps, (step) => step.n, "publishSteps");
for (const step of installSteps) invariant(step.body.length > 0, `installSteps.${step.n} needs a body`);
for (const step of publishSteps) invariant(step.body.length > 0, `publishSteps.${step.n} needs a body`);
invariant(PAGE_SIZE === 10, "PAGE_SIZE must match the app's marketplace page size");
