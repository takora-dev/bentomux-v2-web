import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Session state",
  description: "Detach, restart restore, pane history replay, native agent resume and live handoff in Bentomux.",
  alternates: { canonical: "/docs/session-state" },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/session-state">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Session state</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Detach, restart restore, pane history replay, native agent resume and live handoff.</p>
          </header>
          <ul className="flex flex-col gap-4">
            <li className="rounded-sm border border-border bg-canvas-raised p-6"><h2 className="text-body font-medium">Detach</h2><p className="mt-2 text-body-sm text-text-muted">Leave the window without stopping agents. Reattach later to the same layout.</p></li>
            <li className="rounded-sm border border-border bg-canvas-raised p-6"><h2 className="text-body font-medium">Restart restore</h2><p className="mt-2 text-body-sm text-text-muted">Quit the app or restart the machine — Bentomux reopens the same window, panes and scrollback.</p></li>
            <li className="rounded-sm border border-border bg-canvas-raised p-6"><h2 className="text-body font-medium">Pane history replay</h2><p className="mt-2 text-body-sm text-text-muted">Each pane keeps its PTY scrollback so you can review what an agent did while you were away.</p></li>
            <li className="rounded-sm border border-border bg-canvas-raised p-6"><h2 className="text-body font-medium">Live handoff</h2><p className="mt-2 text-body-sm text-text-muted">Hand a running agent to another machine without restarting it.</p></li>
          </ul>
          <p><Link href="/docs/socket-api" className="text-caption text-accent underline underline-offset-2">API →</Link></p>
        </article>
      </DocsShell>
    </main>
  );
}
