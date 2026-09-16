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
  connectingMachines: "/docs/connecting-machines",
  sessionState: "/docs/session-state",
  socketApi: "/docs/socket-api",
  plugins: "/docs/plugins",
  marketplace: "/docs/marketplace",
} as const;

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
    body: "Supported agents, detection, custom labels and direct attach.",
    href: docsPaths.agents,
    cta: "Understand agents →",
  },
  {
    id: "connecting",
    title: "Connecting machines",
    body: "Keep local and SSH machines in one window with combined agent list.",
    href: docsPaths.connectingMachines,
    cta: "Connect your machines →",
  },
  {
    id: "session",
    title: "Session state",
    body: "Detach, restart restore, pane history and live handoff.",
    href: docsPaths.sessionState,
    cta: "Compare state paths →",
  },
  {
    id: "config",
    title: "Configuration",
    body: "Keybindings, themes, sidebar, notifications and scrollback.",
    href: docsPaths.configuration,
    cta: "Configure Bentomux →",
  },
  {
    id: "api",
    title: "API",
    body: "Control Bentomux from scripts, tools and agents via CLI and socket.",
    href: docsPaths.socketApi,
    cta: "Read the API guide →",
  },
  {
    id: "plugins",
    title: "Plugins",
    body: "Author local executable workflow plugins with manifest actions.",
    href: docsPaths.plugins,
    cta: "Write a plugin →",
  },
];
