import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Plugins",
  description: "Author local executable workflow plugins for Bentomux.",
  alternates: { canonical: "/docs/plugins" },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/plugins">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Plugins</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Author local executable workflow plugins with manifest actions and event hooks.</p>
          </header>
          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">Manifest</h2>
            <p className="text-body-sm text-text-muted">A plugin is a directory with a <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">plugin.toml</code> and an executable.</p>
            <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"[plugin]\nname = \"my-plugin\"\nversion = \"0.1.0\"\nactions = [\"on_pane_open\"]\n\n[exec]\ncommand = \"./run.sh\""}</pre>
          </section>
          <p><Link href="/docs/marketplace" className="text-caption text-accent underline underline-offset-2">Marketplace →</Link></p>
        </article>
      </DocsShell>
    </main>
  );
}
