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
  intro:
    "What Bentomux does that a terminal or a multiplexer does not — and where the two of you are simply the same.",
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

/* Rows are chosen so the page is honest in both directions. Where tmux already
   does the thing — splitting, session persistence — it is marked as such.
   Claiming otherwise would be the fastest way to lose anyone who has used tmux
   for a decade. */
const rows = [
  {
    id: "agent-detection",
    feature: "Knows which agent is running",
    description: "Labels the pane from the CLI it detects, without you saying what it is",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "agent-state",
    feature: "Reads what the agent is doing",
    description: "Working, blocked or idle, from what the CLI is actually doing",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "approvals",
    feature: "Approval prompts you can actually see",
    description: "A permission request raises a window instead of scrolling past in a hidden pane",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "remote",
    feature: "Check on a run from your phone",
    description: "Watch panes and answer a prompt from any browser",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "git",
    feature: "Git without leaving the window",
    description: "Branch, changed files, syntax-highlighted diffs, history and push",
    bentomux: true,
    terminalTabs: false,
    tmux: false,
  },
  {
    id: "plugins",
    feature: "Extend it yourself",
    description: "Contribute buttons, panels, tabs, modals and services from a plugin",
    bentomux: true,
    terminalTabs: false,
    tmux: "Plugin required",
  },
  {
    id: "split-panes",
    feature: "Split panes",
    description: "Divide the window into panes you can drag and size",
    bentomux: true,
    terminalTabs: false,
    tmux: true,
  },
  {
    id: "session-restore",
    feature: "Sessions survive a quit",
    description: "Agents still running when you come back, no config file to set up first",
    bentomux: true,
    terminalTabs: false,
    tmux: true,
  },
  {
    id: "native-window",
    feature: "Native window",
    description: "Real app chrome on macOS, Windows and Linux",
    bentomux: true,
    terminalTabs: true,
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

requireCount(rows, 10, "comparisonRows");

export const comparisonRows: readonly ComparisonRow[] = rows;
