import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";
import { configurableAgents, detectedAgents } from "@/content/agents";

export const metadata: Metadata = {
  title: "Agents",
  description: "Supported agents, detection and configuration in Bentomux.",
  alternates: { canonical: "/docs/agents" },
};

export default function DocsAgentsPage() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/agents">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Agents</h1>
            <p className="max-w-prose text-body-lg text-text-muted">
              Any tool that runs in a terminal runs in Bentomux. Detection, labels and direct attach.
            </p>
          </header>

          <section className="flex flex-col gap-4">
            <h2 className="text-heading-sm">Detected automatically ({detectedAgents.length})</h2>
            <p className="max-w-prose text-body-sm text-text-muted">
              If Bentomux finds one of these agents on your machine, its pane is labelled
              automatically. No extra setup.
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
              These agents have a dedicated adapter. Add them in configuration to get richer state
              and approval handling. QwenPaw is configurable-only — it has no detection manifest.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {configurableAgents.map((a) => (
                <li key={a.id} className="rounded-sm border border-border bg-canvas-raised px-4 py-3 text-body-sm text-text">
                  {a.name} <span className="text-text-subtle">· {a.id}</span>
                </li>
              ))}
            </ul>
          </section>

          <p>
            <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">Configure agents →</Link>
          </p>
        </article>
      </DocsShell>
    </main>
  );
}
