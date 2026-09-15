/* AgentRuntime — ENT-003.

   Detection count and the detected names come from the 21 TOML manifests in
   takora-dev/bentomux-v2 `resources/manifests/` (BR-003.1). The manifests carry
   an `id` and no display name, so the labels below are the id in product
   casing; the nine that also have an adapter keep the adapter's own name from
   `src-tauri/src/agents/index.rs` and the generic adapter factories (BR-003.2).

   QwenPaw is configurable and has no manifest, so it appears in the
   configuration list only (BR-003.6). */

import { invariant, requireCount, requireUnique } from "./validate";

export type AgentSupport = "detected" | "configurable";

export type AgentRuntime = {
  readonly id: string;
  readonly name: string;
  readonly support: AgentSupport;
};

export const detectedAgents: readonly AgentRuntime[] = [
  { id: "amp", name: "Amp", support: "detected" },
  { id: "antigravity", name: "Antigravity", support: "detected" },
  { id: "claude", name: "Claude Code", support: "detected" },
  { id: "cline", name: "Cline", support: "detected" },
  { id: "codex", name: "OpenAI Codex", support: "detected" },
  { id: "cursor", name: "Cursor", support: "detected" },
  { id: "devin", name: "Devin", support: "detected" },
  { id: "droid", name: "Droid", support: "detected" },
  { id: "gemini", name: "Gemini CLI", support: "detected" },
  { id: "github-copilot", name: "GitHub Copilot", support: "detected" },
  { id: "grok", name: "Grok CLI", support: "detected" },
  { id: "hermes", name: "Hermes", support: "detected" },
  { id: "kilo", name: "Kilo Code", support: "detected" },
  { id: "kimi", name: "Kimi CLI", support: "detected" },
  { id: "kiro", name: "Kiro", support: "detected" },
  { id: "maki", name: "Maki", support: "detected" },
  { id: "muse", name: "Muse", support: "detected" },
  { id: "opencode", name: "OpenCode", support: "detected" },
  { id: "pi", name: "pi", support: "detected" },
  { id: "qodercli", name: "Qoder CLI", support: "detected" },
  { id: "qwen", name: "Qwen CLI", support: "detected" },
] as const;

export const configurableAgents: readonly AgentRuntime[] = [
  { id: "claude", name: "Claude Code", support: "configurable" },
  { id: "pi", name: "pi", support: "configurable" },
  { id: "qwen", name: "Qwen CLI", support: "configurable" },
  { id: "codex", name: "OpenAI Codex", support: "configurable" },
  { id: "opencode", name: "OpenCode", support: "configurable" },
  { id: "gemini", name: "Gemini CLI", support: "configurable" },
  { id: "cursor", name: "Cursor", support: "configurable" },
  { id: "kilo", name: "Kilo Code", support: "configurable" },
  { id: "qwenpaw", name: "QwenPaw", support: "configurable" },
] as const;

/** BR-003.1 / BR-003.2: facts owned here, referenced nowhere else by number. */
export const agentCounts = {
  detected: detectedAgents.length,
  configurable: configurableAgents.length,
} as const;

invariant(agentCounts.detected === 21, "detected agent count must match the 21 manifests (BR-003.1)");
invariant(agentCounts.configurable === 9, "configurable agent count must match the adapter registry (BR-003.2)");
invariant(
  !detectedAgents.some((agent) => agent.id === "qwenpaw"),
  "QwenPaw has no detection manifest and must not appear in the detected list (BR-003.6)",
);
requireCount(configurableAgents, 9, "configurableAgents");
requireUnique(detectedAgents, (agent) => agent.id, "detectedAgents");
requireUnique(configurableAgents, (agent) => agent.id, "configurableAgents");
