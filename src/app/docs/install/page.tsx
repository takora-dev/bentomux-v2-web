import type { Metadata } from "next";

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
          <h2 className="text-heading-sm">Homebrew</h2>
          <p className="text-body-sm text-text-muted">
            A cask is published to the project&apos;s tap and bumped with every release:
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"brew install --cask takora-dev/tap/bentomux"}</pre>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Platform support</h2>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full border-collapse text-left text-caption">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Platform</th>
                  <th scope="col" className="px-4 py-3 font-medium">Architectures</th>
                  <th scope="col" className="px-4 py-3 font-medium">Formats</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">macOS</td>
                  <td className="px-4 py-3">Apple Silicon and Intel</td>
                  <td className="px-4 py-3 text-mono">.dmg</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Linux</td>
                  <td className="px-4 py-3">x86_64 only</td>
                  <td className="px-4 py-3 text-mono">.AppImage, .deb</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Windows</td>
                  <td className="px-4 py-3">x86_64</td>
                  <td className="px-4 py-3 text-mono">.msi, -setup.exe</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-body-sm text-text-muted">
            There is no Linux arm64 build yet. The installer tells you so rather than fetching the wrong
            artefact. The Linux installer drops the AppImage in{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">~/.local/bin</code> and writes a
            desktop entry; the <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">--deb</code> form
            goes through apt and needs root.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Unsigned builds</h2>
          <p className="text-body-sm text-text-muted">
            Bentomux ships without code signing or notarisation, so your OS will stop and ask.
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>
              <strong className="text-text">macOS</strong> &mdash; the first launch is blocked with{" "}
              <em>damaged or can&apos;t be opened</em>. Open{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">System Settings &rarr; Privacy
              &amp; Security</code> and choose <em>Open Anyway</em>, or right-click the app and choose Open.
            </li>
            <li>
              <strong className="text-text">Windows</strong> &mdash; SmartScreen warns on the .msi. Choose{" "}
              <em>More info &rarr; Run anyway</em>.
            </li>
            <li>
              <strong className="text-text">Linux</strong> &mdash; AppImage needs the executable bit, which
              the installer sets for you.
            </li>
          </ul>
          <p className="text-body-sm text-text-muted">
            The installer still verifies the SHA-256 of every download against the release manifest. That
            check is independent of signing, and it is what tells you the file is the one the project
            published.
          </p>
        </section>

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
      </article>
    </DocsShell>
  );
}
