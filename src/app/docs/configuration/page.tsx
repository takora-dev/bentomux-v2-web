import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Configuration",
  description:
    "Settings, shortcuts, palettes, terminal fonts, notifications and the Bentomux state file.",
  alternates: { canonical: "/docs/configuration" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/configuration">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Configuration</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            Every setting lives in the Settings view. There is no config file to hand-edit &mdash; Bentomux
            writes its own.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Where settings live</h2>
          <p className="text-body-sm text-text-muted">
            Preferences, workspaces, tabs and split layouts are written to one JSON file in the app data
            directory. It is created on first run:
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"~/Library/Application Support/bentomux/bentomux.json   (macOS)\n~/.config/bentomux/bentomux.json                    (Linux)\n%APPDATA%\\bentomux\\bentomux.json                  (Windows)"}</pre>
          <p className="text-body-sm text-text-muted">
            Close the app before editing it. Anything you change is overwritten the next time Bentomux saves.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Shortcuts</h2>
          <p className="text-body-sm text-text-muted">
            Three actions are rebindable. Click a shortcut chip, then press the new combination. macOS uses{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Cmd</code>, Windows and Linux use{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Ctrl</code>.
          </p>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full border-collapse text-left text-caption">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Action</th>
                  <th scope="col" className="px-4 py-3 font-medium">Default</th>
                  <th scope="col" className="px-4 py-3 font-medium">Rebindable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Command palette</td>
                  <td className="px-4 py-3 text-mono">Cmd/Ctrl + K</td>
                  <td className="px-4 py-3">Yes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Split pane (horizontal)</td>
                  <td className="px-4 py-3 text-mono">Cmd/Ctrl + \\</td>
                  <td className="px-4 py-3">Yes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Split pane (vertical)</td>
                  <td className="px-4 py-3 text-mono">Cmd/Ctrl + Shift + \\</td>
                  <td className="px-4 py-3">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Copy selection, paste, close modal</td>
                  <td className="px-4 py-3 text-mono">Ctrl + C / Ctrl + V / Esc</td>
                  <td className="px-4 py-3">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-body-sm text-text-muted">
            There is no modal prefix key. Everything else is on the mouse, the command palette, or the{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Cmd/Ctrl + K</code> palette.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Appearance</h2>
          <p className="text-body-sm text-text-muted">
            Light, dark or follow the system. On a fresh install the theme follows the OS, and an explicit
            choice from then on wins.
          </p>
          <p className="text-body-sm text-text-muted">Palettes:</p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"default  ·  catppuccin  ·  catppuccin-frappe  ·  catppuccin-macchiato\ncatppuccin-mocha  ·  rose-pine  ·  gruvbox  ·  dracula\nnord  ·  classic  ·  eink  ·  tokyo-night  ·  pastel-pixel\ncustom"}</pre>
          <p className="text-body-sm text-text-muted">
            <strong className="text-text">Custom</strong> takes three colours &mdash; background, ink and
            accent &mdash; and derives every other token from them in CSS.
          </p>
          <p className="text-body-sm text-text-muted">
            The terminal font family and size are set separately from the interface font.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Shell and terminal</h2>
          <p className="text-body-sm text-text-muted">
            The shell setting applies to <em>new</em> terminals. Leave it unset and Bentomux auto-detects,
            preferring PowerShell on Windows, then the classic shell. Panes that are already running keep the
            shell they started with.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Notifications</h2>
          <p className="text-body-sm text-text-muted">
            Agent approval prompts raise an always-on-top overlay plus an optional sound. Both are on by
            default; you can silence the sound, or turn the notification off entirely. The overlay window is
            resizable and remembers its size.
          </p>
          <p className="text-body-sm text-text-muted">
            Prompts only arrive if the agent hook bridge is installed. See{" "}
            <Link href="/docs/approvals" className="text-accent underline underline-offset-2">Approvals</Link>.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Layout and updates</h2>
          <p className="text-body-sm text-text-muted">
            Sidebar width, which sidebar sections are expanded, custom tab titles, and your last eight recent
            folders are all remembered. Auto-update is on by default and can be turned off in Settings.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Safe mode</h2>
          <p className="text-body-sm text-text-muted">
            A plugin that throws on every launch would otherwise make the app unusable. Bentomux counts
            consecutive failed boots and drops into safe mode on its own, disabling plugins until you clear
            it. You can also start it deliberately:
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"bentomux --safe-mode"}</pre>
        </section>

        <p>
          <Link href="/docs/session-state" className="text-caption text-accent underline underline-offset-2">
            Sessions and panes &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
