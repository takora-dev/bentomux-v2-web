import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";
import { CommandBlock } from "@/components/install/CommandBlock";
import { site } from "@/content/site";
import { commandsForPanel, installOptions, manualDownloads } from "@/content/install";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Install",
  description: "Install Bentomux on macOS, Linux and Windows.",
  alternates: { canonical: "/docs/install" },
};

export default function DocsInstallPage() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <DocsShell current="/docs/install">
        <article className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-overline text-accent uppercase">Documentation</p>
            <h1 className="text-display-sm">Install</h1>
            <p className="max-w-prose text-body-lg text-text-muted">
              One command per platform. The installer resolves the latest release, verifies its
              SHA-256 and installs without asking for administrator rights on macOS and Windows.
            </p>
          </header>

          {installOptions.map((option) => {
            const commands = commandsForPanel(option.id);
            return (
              <section key={option.id} className="flex flex-col gap-4">
                <h2 className="text-heading-sm capitalize">{option.label}</h2>
                <div className="flex flex-col gap-3">
                  {commands.map((cmd) => (
                    <CommandBlock
                      key={cmd.id}
                      command={cmd.command}
                      note={cmd.requiresRoot ? "Requires root" : cmd.caption}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <section className="flex flex-col gap-3">
            <h2 className="text-heading-sm">{manualDownloads.label}</h2>
            <p className="text-body-sm text-text-muted">
              {manualDownloads.sentence.before}
              {manualDownloads.formats.join(", ")}
              {manualDownloads.sentence.between}
              <a href={manualDownloads.url} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">
                {manualDownloads.sentence.link}
              </a>
              {manualDownloads.sentence.after}
            </p>
            <p>
              <a href={site.releasesLatestUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary", "sm")}>
                Latest release
              </a>
            </p>
          </section>

          <p>
            <Link href="/docs/quick-start" className="text-caption text-accent underline underline-offset-2">
              Next: Quick start →
            </Link>
          </p>
        </article>
      </DocsShell>
    </main>
  );
}
