import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Configuration",
  description: "Configure keybindings, themes, sidebar, notifications and more in Bentomux.",
  alternates: { canonical: "/docs/configuration" },
};

export default function DocsConfigurationPage() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/configuration">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Configuration</h1>
            <p className="max-w-prose text-body-lg text-text-muted">Keybindings, themes, sidebar, notifications, scrollback and advanced options.</p>
          </header>

          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">Where it lives</h2>
            <p className="text-body-sm text-text-muted">Bentomux reads its config from the standard platform location:</p>
            <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"~/.config/bentomux/config.toml  (Linux)\n~/Library/Application Support/bentomux/config.toml  (macOS)"}</pre>
          </section>

          <section className="flex flex-col gap-3">
            <h2 id="keybindings" className="scroll-mt-nav text-heading-sm">Keybindings</h2>
            <p className="text-body-sm text-text-muted">Prefix is <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">ctrl+b</code> by default. All bindings are re-mappable in config.</p>
            <div className="overflow-x-auto rounded-sm border border-border">
              <table className="w-full border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-border bg-canvas-raised text-left text-overline text-text-subtle">
                    <th className="px-4 py-3 font-normal">Action</th>
                    <th className="px-4 py-3 font-normal">Default</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  <tr className="border-b border-border"><td className="px-4 py-3">Split horizontal</td><td className="px-4 py-3 font-mono">ctrl+b %</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-3">Split vertical</td><td className="px-4 py-3 font-mono">ctrl+b &quot;</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-3">Focus pane</td><td className="px-4 py-3 font-mono">ctrl+b arrows</td></tr>
                  <tr><td className="px-4 py-3">Detach</td><td className="px-4 py-3 font-mono">ctrl+b d</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">Themes & sidebar</h2>
            <p className="text-body-sm text-text-muted">Themes control accent and surface colours; sidebar behavior (auto-hide, pinned, collapsed) is per-workspace and persisted with the session.</p>
          </section>

          <p><Link href="/docs/session-state" className="text-caption text-accent underline underline-offset-2">Session state →</Link></p>
        </article>
      </DocsShell>
    </main>
  );
}
