import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";
import { configurableAgents, detectedAgents } from "@/content/agents";

export const metadata: Metadata = {
  title: "Agents",
  description: "Detected agent CLIs in Bentomux, and the adapters that track what each one is doing.",
  alternates: { canonical: "/docs/agents" },
};

export default function DocsAgentsPage() {
  return (
    <DocsShell current="/docs/agents">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Agents</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            Any tool that runs in a terminal runs in a Bentomux pane. These are the ones it knows how to
            label, track and configure.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-sm">Detected automatically ({detectedAgents.length})</h2>
          <p className="max-w-prose text-body-sm text-text-muted">
            Bentomux looks for these on your machine and labels the pane when one is running. No setup, no
            config file. Anything not on this list still runs &mdash; it just shows as a plain shell.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {detectedAgents.map((a) => (
              <li key={a.id} className="rounded-sm border border-border bg-canvas-raised px-4 py-3 text-body-sm text-text">
                {a.name} <span className="text-text-subtle">· {a.id}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-sm">Configurable adapters ({configurableAgents.length})</h2>
          <p className="max-w-prose text-body-sm text-text-muted">
            These have a dedicated adapter, which means a richer state model: Bentomux reads what the agent
            is doing rather than guessing from terminal output, and can surface its approval prompts.{" "}
            {configurableAgents.length} of them. QwenPaw is configurable-only &mdash; it has no detection
            manifest, so add it by hand.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {configurableAgents.map((a) => (
              <li key={a.id} className="rounded-sm border border-border bg-canvas-raised px-4 py-3 text-body-sm text-text">
                {a.name} <span className="text-text-subtle">· {a.id}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Approvals</h2>
          <p className="text-body-sm text-text-muted">
            Agents that prompt for permission can raise a Bentomux overlay instead of waiting silently at the
            back of a pane. See <Link href="/docs/approvals" className="text-accent underline underline-offset-2">Approvals</Link>.
          </p>
        </section>

        <p>
          <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">Configuration →</Link>
        </p>
      </article>
    </DocsShell>
  );
}
