import { requireCount } from "./validate";

export type ComparisonValue = boolean | string;

export interface ComparisonRow {
  readonly id: string;
  readonly feature: string;
  readonly description?: string;
  readonly bentomux: ComparisonValue;
  readonly terminalTabs: ComparisonValue;
  readonly tmux: ComparisonValue;
}

export const comparisonCopy = {
  eyebrow: "Why Bentomux",
  heading: "How it stacks up",
  intro: "See how Bentomux compares to running agents in plain terminal tabs or tmux.",
  columns: {
    bentomux: "Bentomux",
    terminalTabs: "Terminal tabs",
    tmux: "tmux",
  },
  legend: {
    yes: "Yes",
    no: "No",
  },
} as const;

const rows = [
  {
    id: "multi-agent",
    feature: "Multi-agent layout",
    description: "Run many agents side-by-side in one window",
    bentomux: true,
    terminalTabs: false,
    tmux: "Manual only",
  },
  {
    id: "named-panes",
    feature: "Named panes",
    description: "Label each pane with the agent or task running inside",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "session-restore",
    feature: "Session restore",
    description: "Reopen your layout exactly where you left off",
    bentomux: true,
    terminalTabs: false,
    tmux: "Plugin required",
  },
  {
    id: "gui-native",
    feature: "Native macOS & Linux GUI",
    description: "No config file needed to get started",
    bentomux: true,
    terminalTabs: true,
    tmux: false,
  },
  {
    id: "focus-mode",
    feature: "Focus mode",
    description: "Zoom into one pane without closing others",
    bentomux: true,
    terminalTabs: false,
    tmux: "Zoom pane only",
  },
  {
    id: "keyboard",
    feature: "Keyboard-first",
    description: "Every action reachable without a mouse",
    bentomux: true,
    terminalTabs: false,
    tmux: true,
  },
  {
    id: "copy-output",
    feature: "One-click output copy",
    description: "Copy agent output without leaving the keyboard",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "free",
    feature: "Free & open source",
    bentomux: true,
    terminalTabs: true,
    tmux: true,
  },
] satisfies ComparisonRow[];

requireCount(rows, 8, "comparisonRows");

export const comparisonRows: readonly ComparisonRow[] = rows;
