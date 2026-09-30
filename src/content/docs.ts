export const docsCopy = {
  eyebrow: "Documentation",
  heading: "Documentation",
  intro: "Install, learn and configure Bentomux. No multiplexer experience required.",
} as const;

export const docsPaths = {
  install: "/docs/install",
  quickStart: "/docs/quick-start",
  agents: "/docs/agents",
  configuration: "/docs/configuration",
  sessionState: "/docs/session-state",
  git: "/docs/git",
  approvals: "/docs/approvals",
  remote: "/docs/remote",
  plugins: "/docs/plugins",
} as const;

/* Sidebar model. The sidebar reads in two dimensions (groups) and prev/next
   reads in one (reading order), so the groups are the source and the flat list
   is derived — the order can only be written down once (FR-006 CON-005). */
export interface DocsNavItem {
  readonly id: string;
  readonly title: string;
  readonly href: string;
}

export interface DocsNavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly DocsNavItem[];
}

export const docsNav: readonly DocsNavGroup[] = [
  {
    id: "getting-started",
    label: "Getting started",
    items: [
      { id: "overview", title: "Overview", href: "/docs" },
      { id: "install", title: "Install", href: docsPaths.install },
      { id: "quick-start", title: "Quick start", href: docsPaths.quickStart },
    ],
  },
  {
    id: "core-guides",
    label: "Core guides",
    items: [
      { id: "agents", title: "Agents", href: docsPaths.agents },
      { id: "session-state", title: "Sessions and panes", href: docsPaths.sessionState },
      { id: "configuration", title: "Configuration", href: docsPaths.configuration },
      { id: "approvals", title: "Approvals", href: docsPaths.approvals },
      { id: "git", title: "Git tools", href: docsPaths.git },
      { id: "remote", title: "Remote monitor", href: docsPaths.remote },
      { id: "plugins", title: "Plugins", href: docsPaths.plugins },
    ],
  },
];

/* Flat reading order, derived: prev/next must walk the same order the sidebar
   groups, and two hand-written lists would drift. */
export const docsOrder: readonly DocsNavItem[] = docsNav.flatMap((group) => group.items);

/* The "Edit this page" target. Each route is a hand-written `page.tsx`, so the
   path is mechanical — deriving it keeps the link correct for pages added later
   instead of repeating a repo path ten times. */
export function docsSourcePath(href: string): string {
  return href === "/docs" ? "src/app/docs/page.tsx" : `src/app/docs${href.slice(5)}/page.tsx`;
}

export interface DocsCard {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly href: string;
  readonly cta: string;
}

export const docsCards: readonly DocsCard[] = [
  {
    id: "agents",
    title: "Agents",
    body: "Detection for 22 agent CLIs, and the adapters that track what each one is doing.",
    href: docsPaths.agents,
    cta: "Set up your agents →",
  },
  {
    id: "session",
    title: "Sessions and panes",
    body: "What survives a restart, and the daemon that keeps your agents running.",
    href: docsPaths.sessionState,
    cta: "Understand session state →",
  },
  {
    id: "config",
    title: "Configuration",
    body: "Shortcuts, palettes, fonts, shell, notifications and the state file.",
    href: docsPaths.configuration,
    cta: "Configure Bentomux →",
  },
  {
    id: "approvals",
    title: "Approvals",
    body: "The hook bridge, the always-on-top overlay, and approving from your phone.",
    href: docsPaths.approvals,
    cta: "Set up approvals →",
  },
  {
    id: "git",
    title: "Git tools",
    body: "Branch, changed files, syntax-highlighted diffs, history and push.",
    href: docsPaths.git,
    cta: "Use Git tools →",
  },
  {
    id: "remote",
    title: "Remote monitor",
    body: "Watch panes and approve from any browser on your network.",
    href: docsPaths.remote,
    cta: "Watch from your phone →",
  },
  {
    id: "plugins",
    title: "Plugins",
    body: "Author a manifest, contribute UI surfaces, and validate before you ship.",
    href: docsPaths.plugins,
    cta: "Write a plugin →",
  },
];
