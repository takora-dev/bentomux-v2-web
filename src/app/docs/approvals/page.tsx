import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Approvals",
  description:
    "Route coding-agent permission prompts to a Bentomux overlay, and approve or deny them without being at the machine.",
  alternates: { canonical: "/docs/approvals" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/approvals">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Approvals</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            A coding agent in a background pane will eventually ask permission for something. Bentomux turns
            that prompt into an overlay you can answer, wherever you are.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Install the hook</h2>
          <p className="text-body-sm text-text-muted">
            Approvals only work if the agent tells Bentomux about them. Bentomux ships a hook script that
            agents load from their own settings file &mdash; install it once from Settings &gt; Agents.
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>Install is idempotent. Running it twice does not duplicate the entries.</li>
            <li>
              Hooks Bentomux did not write are never touched. Uninstall removes exactly what was added, and
              restores any values that were changed from Bentomux&apos;s own defaults.
            </li>
            <li>Settings shows which hook events are currently present, so you can see what took effect.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">The overlay</h2>
          <p className="text-body-sm text-text-muted">
            When a prompt arrives, Bentomux raises a small always-on-top window over everything else. It
            shows what the agent wants, and offers three answers:
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>
              <strong className="text-text">Approve</strong> &mdash; the agent continues.
            </li>
            <li>
              <strong className="text-text">Deny</strong> &mdash; the agent is told no.
            </li>
            <li>
              <strong className="text-text">Jump to tab</strong> &mdash; brings the pane that is asking to the
              front, for when you want to look before deciding.
            </li>
          </ul>
          <p className="text-body-sm text-text-muted">
            The window is resizable and remembers its size. A chime plays with the prompt; both the sound and
            the notification can be turned off in Settings. If the bridge cannot be reached, approval fails
            open &mdash; the agent is not left blocked on a prompt nobody can see.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Answering from your phone</h2>
          <p className="text-body-sm text-text-muted">
            A pending prompt shows up in the remote monitor too, and Approve and Deny there close the same
            prompt through the same code path. Every surface closes via one event, so a prompt can never be
            answered twice or left hanging.
          </p>
          <p className="text-body-sm text-text-muted">
            Enabling the remote monitor for this is described in{" "}
            <Link href="/docs/remote" className="text-accent underline underline-offset-2">Remote monitor</Link>.
          </p>
        </section>

        <p>
          <Link href="/docs/agents" className="text-caption text-accent underline underline-offset-2">
            Agents &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
