import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Connecting machines",
  description: "Keep local and saved SSH machines in one Bentomux window.",
  alternates: { canonical: "/docs/connecting-machines" },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/connecting-machines">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Connecting machines</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Local and saved SSH machines in one window, with a combined agent list and independent reconnects.</p>
          </header>
          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">Add a machine</h2>
            <p className="text-body-sm text-text-muted">Save an SSH host once — Bentomux keeps it in the sidebar alongside your local workspace. Each machine reconnects independently.</p>
            <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"Host my-server\n  HostName 192.168.1.50\n  User you"}</pre>
            <p className="text-body-sm text-text-muted">Add it in settings or point Bentomux at your existing SSH config. No agent restart needed.</p>
          </section>
          <p><Link href="/docs/session-state" className="text-caption text-accent underline underline-offset-2">Session state →</Link></p>
        </article>
      </DocsShell>
    </main>
  );
}
