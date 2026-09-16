import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "API",
  description: "Control Bentomux from scripts, tools and agents via CLI and local socket.",
  alternates: { canonical: "/docs/socket-api" },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/socket-api">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">API</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Control Bentomux from scripts, tools and agents through the CLI and local socket API.</p>
          </header>
          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">CLI</h2>
            <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"bentomux --help\nbentomux new-session my-work\nbentomux attach"}</pre>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">Socket</h2>
            <p className="text-body-sm text-text-muted">Bentomux exposes a local socket for programmatic control. Agents can list panes, send input and read output without going through the UI.</p>
            <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"echo '{\"method\":\"list_panes\"}' | nc -U /tmp/bentomux.sock"}</pre>
          </section>
          <p><Link href="/docs/plugins" className="text-caption text-accent underline underline-offset-2">Plugins →</Link></p>
        </article>
      </DocsShell>
    </main>
  );
}
