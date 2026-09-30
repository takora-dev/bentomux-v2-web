import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Remote monitor",
  description:
    "Watch Bentomux panes and answer agent approval prompts from any browser, over an end-to-end encrypted tunnel.",
  alternates: { canonical: "/docs/remote" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/remote">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Remote monitor</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            Start a run, leave the house, and still see which agent is stuck and what it is asking for.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Turning it on</h2>
          <p className="text-body-sm text-text-muted">
            Settings &gt; Remote. It is off by default. Turning it on generates a pairing token and a QR code
            &mdash; scan it with a phone and the monitor opens in that browser.
          </p>
          <p className="text-body-sm text-text-muted">
            The port defaults to <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">8765</code> and
            is changeable if something else on your network already has it. The token is generated once and
            kept, so paired devices survive a restart.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">How the connection works</h2>
          <p className="text-body-sm text-text-muted">
            The local server binds to loopback only. It is never exposed to your network directly. Instead
            Bentomux runs a bundled{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">cloudflared</code> quick tunnel,
            which gives it a public{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">https://trycloudflare.com</code> URL.
            That URL, with the token embedded, is what the QR encodes &mdash;
            there is nothing else to type.
          </p>
          <p className="text-body-sm text-text-muted">
            The tunnel is end-to-end encrypted and the server refuses plain HTTP. Screen text is rendered
            headlessly, so what you see on the phone is the pane&apos;s actual contents with escape sequences
            already consumed.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">What you can do</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>Watch the panes you select, updating live while output is moving.</li>
            <li>See the full list of workspaces and panes, and which pane is focused.</li>
            <li>Switch between panes.</li>
            <li>Type into the pane you are watching.</li>
            <li>Answer approval prompts, through the same path the local overlay uses.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">Treat the link like a password</h2>
          <p className="text-body-sm text-text-muted">
            The pairing token grants full control: everything listed above, on every pane. Anyone holding that
            URL can type into your shells. Do not post it, do not put it in a shared channel, and turn remote
            monitoring off when you do not need it.
          </p>
          <p className="text-body-sm text-text-muted">
            The token is exchanged once for an{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">HttpOnly</code> cookie that expires
            after twelve hours, rather than being kept in the URL &mdash; so it does not linger in browser
            history or leak through{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">Referer</code> headers.
            Authentication attempts are rate-limited, and message size and write rate per socket are capped.
          </p>
        </section>

        <p>
          <Link href="/docs/approvals" className="text-caption text-accent underline underline-offset-2">
            Approvals &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
