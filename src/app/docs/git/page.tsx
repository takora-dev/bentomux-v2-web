import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Git tools",
  description:
    "Read a workspace's Git state inside Bentomux: branch, changed files, syntax-highlighted diffs, history and push.",
  alternates: { canonical: "/docs/git" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/git">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Git tools</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            When a workspace is a repository, Bentomux shows you what changed and lets you push &mdash;
            without leaving the window.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">The panel</h2>
          <p className="text-body-sm text-text-muted">
            Git tools live in the right sidebar, next to the agent running in that workspace. The header shows
            the current branch, or{" "}
            <em>Detached HEAD</em> when the repository is in that state. A workspace that is not a repository
            says so plainly rather than showing an empty panel.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Changes</h2>
          <p className="text-body-sm text-text-muted">
            Every modified, staged, untracked or conflicted path, with a status badge and the changed-line
            count. Click a file to read its diff, syntax-highlighted with the same highlighter the app uses
            for the rest of its code views. A clean working tree says so.
          </p>
          <p className="text-body-sm text-text-muted">
            The panel is read-only. Stage, commit, stash and branch stay in your terminal &mdash; the same
            place the agent is already working.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">History</h2>
          <p className="text-body-sm text-text-muted">
            Recent commits for the current branch, with a per-commit file summary. Open one to see what it
            touched.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Push</h2>
          <p className="text-body-sm text-text-muted">
            Pushes the current branch. Bentomux is upstream-aware: if the branch has never been pushed, it
            sets the upstream on the first push instead of failing, so a new branch goes out in one step.
            Failure output is shown as-is rather than swallowed.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Watching</h2>
          <p className="text-body-sm text-text-muted">
            Bentomux watches the repository. If a branch is checked out or changed underneath you &mdash;
            often because an agent did it &mdash; the panel updates and tab titles fall back to the new
            branch name when you have not set a custom one.
          </p>
        </section>

        <p>
          <Link href="/docs/remote" className="text-caption text-accent underline underline-offset-2">
            Remote monitor &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
