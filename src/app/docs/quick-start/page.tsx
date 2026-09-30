import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Quick start",
  description: "Get Bentomux running in under two minutes.",
  alternates: { canonical: "/docs/quick-start" },
};

export default function DocsQuickStartPage() {
  return (
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
              Run the command for your platform from <Link href="/docs/install" className="text-accent underline underline-offset-2">Install</Link>. There is no config file to write &mdash; the app creates its own on first run.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-sm bg-canvas px-4 py-3 text-mono text-text">{`curl -fsSL ${site.siteUrl}/install.sh | sh`}</pre>
          </li>
          <li className="rounded-sm border border-border bg-canvas-raised p-6">
            <h2 className="text-body font-medium text-text">2. Add a workspace</h2>
            <p className="mt-2 text-body-sm text-text-muted">
              Launch the app and add a folder &mdash; a project directory. Its terminal opens in the working
              directory you chose, and the sidebar remembers it. Add as many workspaces as you are working in.
            </p>
            <p className="mt-2 text-body-sm text-text-muted">
              Split with <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Cmd/Ctrl + \</code>, drag
              the borders, and rename tabs from the UI. The command palette is{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Cmd/Ctrl + K</code> if you would
              rather not use the mouse.
            </p>
          </li>
          <li className="rounded-sm border border-border bg-canvas-raised p-6">
            <h2 className="text-body font-medium text-text">3. Run your agents</h2>
            <p className="mt-2 text-body-sm text-text-muted">
              In each pane, start whichever agent you want — Claude Code, Codex CLI, pi, or any shell tool.
              Bentomux labels the pane once it recognises the agent.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-sm bg-canvas px-4 py-3 text-mono text-text">claude  {"# in pane 1"} {"\n"}codex   {"# in pane 2"}</pre>
            <p className="mt-2 text-body-sm text-text-muted">
              Switch panes freely — the shells keep running. Quit the app and come back: your agents are
              still there. That part is covered in{" "}
              <Link href="/docs/session-state" className="text-accent underline underline-offset-2">Sessions and panes</Link>.
            </p>
          </li>
        </ol>

        <div className="flex flex-wrap gap-3 border-t border-border pt-8">
          <Link href="/docs/agents" className="text-caption text-accent underline underline-offset-2">Agents →</Link>
          <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">Configuration →</Link>
        </div>
      </article>
    </DocsShell>
  );
}
