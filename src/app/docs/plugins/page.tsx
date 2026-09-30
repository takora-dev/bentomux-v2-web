import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Plugins",
  description:
    "Author a Bentomux plugin: plugin.json manifest, nine contribution points, permissions, network origins, and the CLI validator.",
  alternates: { canonical: "/docs/plugins" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/plugins">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Plugins</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            A plugin is a directory of JavaScript that adds buttons, panels, tabs, modals and background
            services to the app.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Shape</h2>
          <p className="text-body-sm text-text-muted">
            Two files minimum: a JSON manifest and an ES module entry point.
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"my-plugin/\n  plugin.json\n  index.js"}</pre>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{'{\n  "id": "acme.my-plugin",\n  "name": "My Plugin",\n  "version": "0.1.0",\n  "apiVersion": 1,\n  "entry": "index.js",\n  "permissions": ["storage"],\n  "contributes": {\n    "commands": [{ "id": "acme.my-plugin.hello", "title": "My Plugin: Hello" }]\n  }\n}'}</pre>
          <p className="text-body-sm text-text-muted">
            The entry exports an <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">activate(ctx)</code>{" "}
            function. <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">ctx</code> is the only
            handle you get &mdash; commands, storage, and the surfaces you declared.
          </p>
          <p className="text-body-sm text-text-muted">
            Your <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">id</code> must look like{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">publisher.plugin</code> in lowercase.
            The <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">bentomux</code> publisher is
            reserved.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Surfaces</h2>
          <p className="text-body-sm text-text-muted">Nine places a plugin can appear:</p>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full border-collapse text-left text-caption">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Key</th>
                  <th scope="col" className="px-4 py-3 font-medium">Adds</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">commands</td>
                  <td className="px-4 py-3">Palette entries and keybindable actions</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">topbar</td>
                  <td className="px-4 py-3">A button in the top bar</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">sidebar</td>
                  <td className="px-4 py-3">An entry in the left sidebar</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">dock</td>
                  <td className="px-4 py-3">An item in the bottom dock</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">tabs</td>
                  <td className="px-4 py-3">A custom tab type</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">modals</td>
                  <td className="px-4 py-3">A modal dialog</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">widgets</td>
                  <td className="px-4 py-3">A panel in the right sidebar</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-mono">settings</td>
                  <td className="px-4 py-3">A section in the Settings modal</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono">services</td>
                  <td className="px-4 py-3">A headless background task</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Permissions</h2>
          <p className="text-body-sm text-text-muted">
            Declare what you use. The manifest rejects any name it does not know.
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"storage            app.read           app.prefs.write\napp.window         files.temp         workspaces.write\ntabs.write         terminal.read      terminal.input\ngit.read          git.push           agents.read\nagents.write       remote.control     backend.invoke"}</pre>
          <p className="text-body-sm text-text-muted">
            Be honest about the ceiling here: permissions are a declared contract, not a sandbox. Plugins
            run in the app&apos;s own web context, with the same reach the host has. Review what you install the way
            you would review a shell alias.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Validate before you ship</h2>
          <p className="text-body-sm text-text-muted">
            The validator runs from a terminal &mdash; no need to open the app. Exit <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">0</code>{" "}
            is clean, <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">1</code> means errors,{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">2</code> is a usage mistake.
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"bentomux --plugin-validate ./my-plugin\nbentomux --plugin-validate ./my-plugin --json"}</pre>
          <p className="text-body-sm text-text-muted">It checks, without running any of your code:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>the manifest exists, parses, and matches the schema</li>
            <li>
              the <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">id</code> is well formed and
              not using the reserved publisher
            </li>
            <li>
              <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">version</code> and{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">minAppVersion</code> are semver,{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">apiVersion</code> is known
            </li>
            <li>the entry file exists, is inside the plugin root, and is not empty</li>
            <li>every contribution id is namespaced under your plugin id and unique</li>
            <li>every permission name is one the app knows</li>
            <li>every command referenced by a button, sidebar entry or dock item is declared</li>
            <li>icons resolve &mdash; a builtin name, or a file that exists</li>
            <li>every network origin is a bare https:// host with no path</li>
            <li>the whole plugin is under 5 MB</li>
          </ul>
          <p className="text-body-sm text-text-muted">
            The CLI additionally runs <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">node --check</code>{" "}
            on the entry to catch syntax errors. The in-app validator skips that step, because Node is not
            guaranteed at runtime; a syntax error surfaces at activation instead.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Install</h2>
          <p className="text-body-sm text-text-muted">
            From a folder on disk, from a zip, or over HTTPS. Remote installs must be{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">https://</code> and are checked
            against a pinned SHA-256 before anything is unpacked.
          </p>
          <p className="text-body-sm text-text-muted">
            There is no hosted registry. Plugins are distributed however you like &mdash; a git repository, a
            release asset, a zip on a file share &mdash; and installed by URL or from disk.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Network access</h2>
          <p className="text-body-sm text-text-muted">
            A plugin that fetches an outside website declares it in{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">plugin.json</code> under{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">network</code>, as bare{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">https://host[:port]</code>{" "}
            origins with no path. The Studio install review shows the declared hosts next to the
            permissions, and a host outside the last build stays blocked until the next release.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Start from a template</h2>
          <p className="text-body-sm text-text-muted">
            Seven scaffolding templates ship with the app, one per surface. Each comes with a manifest, an
            entry, and the TypeScript definitions for{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">ctx</code>.
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"basic  ·  topbar  ·  sidebar  ·  tab  ·  modal  ·  widget  ·  service"}</pre>
          <p className="text-body-sm text-text-muted">
            Plugin Studio and the plugin creator are in the app, under Plugins. Studio lists what is installed,
            validates, and lets you remove or reinstall.
          </p>
        </section>

        <p>
          <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">
            Configuration &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
