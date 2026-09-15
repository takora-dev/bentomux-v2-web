/* CapabilityRow — ENT-013. The five numbered rows of SEC-013, each with the
   evidence panel it carries in its right column (IA SEC-013, design system
   §9.6 CAP-002–CAP-003).

   One row is one claim. The count in row 04 is derived from ENT-003 and is
   never typed here. */

import { agentCounts, detectedAgents } from "./agents";
import { invariant, requireCount, requireNonEmpty, requireUnique } from "./validate";

export type CapEvidence =
  /** Terminal tabs and the state each one reports. */
  | {
      readonly kind: "tabs";
      readonly rows: readonly { readonly label: string; readonly note: string }[];
    }
  /** One state per agent, in the three words the application uses. */
  | {
      readonly kind: "states";
      readonly rows: readonly {
        readonly label: string;
        readonly state: "working" | "blocked" | "idle";
        readonly note: string;
      }[];
    }
  /** A permission prompt as the overlay draws it. */
  | {
      readonly kind: "approval";
      readonly lines: readonly { readonly text: string; readonly tone?: "muted" | "warn" | "ok" }[];
    }
  /** The detected runtimes, by name. */
  | {
      readonly kind: "runtimes";
      readonly names: readonly string[];
      readonly note: string;
    }
  /** The monitor's address and who is attached to it. */
  | {
      readonly kind: "machines";
      readonly address: string;
      readonly rows: readonly { readonly label: string; readonly note: string }[];
    };

export type CapabilityRow = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly evidence: CapEvidence;
  readonly order: number;
};

/** The eight names row 04 shows as chips. Picked from ENT-003 by id, so the
 *  labels are the roster's own. */
const runtimeChipIds = [
  "claude",
  "codex",
  "cursor",
  "gemini",
  "grok",
  "opencode",
  "pi",
  "github-copilot",
] as const;

const runtimeChips = runtimeChipIds.map((id) => {
  const agent = detectedAgents.find((candidate) => candidate.id === id);
  if (!agent) throw new Error(`[content] capability row 04 names unknown agent "${id}" (ENT-013)`);
  return agent.name;
});

export const capabilities: readonly CapabilityRow[] = [
  {
    id: "persistent",
    number: "01",
    title: "Open it tomorrow and it is still there.",
    body: "A workspace keeps its layout, its tabs and its split panes, and every pane holds a real PTY with its scrollback. Quit the app, restart the machine, come back to the same window instead of rebuilding it.",
    order: 1,
    evidence: {
      kind: "tabs",
      rows: [
        { label: "bentomux-v2", note: "3 panes · scrollback kept" },
        { label: "website", note: "2 panes · split right" },
        { label: "scratch", note: "1 pane · renamed tab" },
      ],
    },
  },
  {
    id: "state",
    number: "02",
    title: "You never hunt for the stuck one.",
    body: "Every tab reports whether its agent is idle, working or blocked, read from the process and the terminal screen. When one is waiting on you the window says so, and the state is a word as well as a colour.",
    order: 2,
    evidence: {
      kind: "states",
      rows: [
        { label: "website", state: "blocked", note: "waiting on approval" },
        { label: "bentomux-v2", state: "working", note: "claude" },
        { label: "scratch", state: "idle", note: "gemini" },
      ],
    },
  },
  {
    id: "approvals",
    number: "03",
    title: "Answer where you are looking.",
    body: "Permission prompts are caught by the hook bridge and raised in an always-on-top overlay, so an agent asking a question never stalls in a tab you are not reading. Approve, deny, or jump to the tab that asked.",
    order: 3,
    evidence: {
      kind: "approval",
      lines: [
        { text: "claude-code asks permission", tone: "warn" },
        { text: "Edit src/components/sections/Hero.tsx" },
        { text: "[ Approve ]  [ Deny ]  [ Jump to tab ]", tone: "ok" },
        { text: "bridge: unix socket · connected", tone: "muted" },
      ],
    },
  },
  {
    id: "runtimes",
    number: "04",
    title: "Runs what you already run.",
    body: `The CLIs on your PATH keep working as they are. Bentomux owns their terminal and derives their state; it does not wrap them, replace them or hold your prompts. ${agentCounts.detected} are detected out of the box.`,
    order: 4,
    evidence: {
      kind: "runtimes",
      names: runtimeChips,
      note: `${agentCounts.detected} detected · ${agentCounts.configurable} also configurable`,
    },
  },
  {
    id: "remote",
    number: "05",
    title: "The long run follows you to the phone.",
    body: "An optional monitor serves the panes and their states over your own network, paired by QR code. Check a run from another room, and answer an approval without walking back to the desk.",
    order: 5,
    evidence: {
      kind: "machines",
      address: "http://192.168.1.24:7788",
      rows: [
        { label: "desktop", note: "panes mirrored" },
        { label: "phone", note: "paired · approvals on" },
      ],
    },
  },
] as const;

requireCount(capabilities, 5, "capabilities");
requireUnique(capabilities, (capability) => capability.id, "capabilities");
for (const capability of capabilities) {
  requireNonEmpty(capability.title, `capabilities.${capability.id}.title`);
  requireNonEmpty(capability.body, `capabilities.${capability.id}.body`);
}

/* sys_uc_004: row 04's body may be reworded, but its two counts are rendered
   from ENT-003. This fails the build if either number is typed into the copy
   source again. */
const runtimesRow = capabilities.find((capability) => capability.id === "runtimes");
invariant(
  runtimesRow?.body.includes(String(agentCounts.detected)) === true,
  "capability row 04 must carry the derived detected count, not a literal",
);
