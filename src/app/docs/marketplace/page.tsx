import type { Metadata } from "next";

import { DocsShell } from "@/components/docs/DocsNav";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Share Bentomux plugins from GitHub.",
  alternates: { canonical: "/docs/marketplace" },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/marketplace">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Marketplace</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Share plugins from GitHub today and tag your repo to be listed when the marketplace launches.</p>
          </header>
          <section className="rounded-sm border border-border bg-canvas-raised p-6">
            <h2 className="text-body font-medium">Publish a plugin</h2>
            <p className="mt-2 text-body-sm text-text-muted">Push your plugin to GitHub and add the topic <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">bentomux-plugin</code>. It will be discoverable when the marketplace goes live.</p>
            <p className="mt-4 text-body-sm">
              <a href={site.repositoryUrl} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">View on GitHub</a>
            </p>
          </section>
        </article>
      </DocsShell>
    </main>
  );
}
