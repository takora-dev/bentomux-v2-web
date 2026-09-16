import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Quick start",
  description: "Get Bentomux running in under two minutes.",
  alternates: { canonical: "/docs/quick-start" },
};

export default function DocsQuickStartPage() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/quick-start">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Quick start</h1>
            <p className="max-w-prose text-body-lg text-text-muted">
              From install to your first multi-agent layout in three steps.
            </p>
          </header>

          <ol className="flex flex-col gap-6">
            <li className="rounded-sm border border-border bg-canvas-raised p-6">
              <h2 className="text-body font-medium text-text">1. Install</h2>
              <p className="mt-2 text-body-sm text-text-muted">
                Run the command for your platform from <Link href="/docs/install" className="text-accent underline underline-offset-2">Install</Link>. No config file needed to get started.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-sm bg-canvas px-4 py-3 text-mono text-text">curl -fsSL https://bentomux.dev/install.sh | sh</pre>
            </li>
            <li className="rounded-sm border border-border bg-canvas-raised p-6">
              <h2 className="text-body font-medium text-text">2. Open Bentomux</h2>
              <p className="mt-2 text-body-sm text-text-muted">
                Launch the app. You&apos;ll get an empty workspace with a split-pane terminal.
                Split, drag borders and rename panes from the UI — no shortcuts to learn first.
              </p>
            </li>
            <li className="rounded-sm border border-border bg-canvas-raised p-6">
              <h2 className="text-body font-medium text-text">3. Run your agents</h2>
              <p className="mt-2 text-body-sm text-text-muted">
                In each pane, start the agent you want — Claude Code, Codex CLI, pi, or any shell
                tool. Each pane holds a real PTY with scrollback; quitting and reopening restores
                the layout.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-sm bg-canvas px-4 py-3 text-mono text-text">claude  {"# in pane 1"} {"\n"}codex   {"# in pane 2"}</pre>
            </li>
          </ol>

          <div className="flex flex-wrap gap-3 border-t border-border pt-8">
            <Link href="/docs/agents" className="text-caption text-accent underline underline-offset-2">Agents →</Link>
            <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">Configuration →</Link>
          </div>
        </article>
      </DocsShell>
    </main>
  );
}
