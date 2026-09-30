import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Compare",
  description: "What Bentomux does that a terminal or tmux does not, and where they are simply the same.",
  alternates: { canonical: "/compare" },
};

const oneLiners: readonly { title: string; body: string }[] = [
  {
    title: "Bentomux vs terminal tabs",
    body: "A tab cannot tell you what is running in it. Bentomux labels the pane, reads what the agent is doing, and surfaces a permission request instead of letting it scroll away.",
  },
  {
    title: "Bentomux vs tmux",
    body: "tmux already splits panes and keeps sessions alive — Bentomux matches both, with no tmux.conf to write. What it adds on top is a native window that knows what an agent is.",
  },
  { title: "Bentomux vs manager apps", body: "Manager apps put worktrees and review queues in a window. Bentomux is the window itself." },
] as const;

const notes: readonly { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "A window, not tabs in a terminal.",
    body: "Bentomux is a native app — layout, panes and split borders persist as UI, not as a terminal you have to configure.",
  },
  {
    n: "02",
    title: "It knows what a pane is running.",
    body: "Twenty-one agent CLIs are detected and labelled. Nine have a dedicated adapter, which is what makes live state and approval handling possible instead of guesswork.",
  },
  {
    n: "03",
    title: "Persists without config.",
    body: "A background process holds the terminals, so quitting the app does not kill your agents. Reopen and the same panes are back — no tmux.conf, no rescue script.",
  },
  {
    n: "04",
    title: "You can leave the room.",
    body: "Turn on the remote monitor, scan a QR code, and watch the panes or answer an approval prompt from your phone.",
  },
  {
    n: "05",
    title: "Free and open source.",
    body: "MIT licensed. Inspect, fork, contribute.",
  },
] as const;

export default function ComparePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <section className="px-4 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-6">
            <p className="text-overline text-accent uppercase">Compare</p>
            <h1 className="max-w-[18ch] text-display-sm">Bentomux against the field</h1>
            <p className="max-w-prose text-body-lg text-text-muted">
              A terminal gives you a place to type. A multiplexer gives you a grid of them. Bentomux is a native
              window that knows what is running in each pane &mdash; and what it is asking you for.
            </p>
            <p className="text-caption text-text-subtle">Scrolls sideways on a phone.</p>
          </div>
        </section>

        <ComparisonSection />

        <section className="border-t border-border px-4 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            {notes.map((note) => (
              <div key={note.n} className="flex gap-6">
                <span className="shrink-0 font-mono text-mono text-accent">{note.n}</span>
                <div className="flex flex-col gap-2">
                  <h2 className="text-body font-medium text-text">{note.title}</h2>
                  <p className="max-w-prose text-body-sm text-text-muted">{note.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-canvas-raised px-4 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            <h2 className="text-heading-sm">One-liners, for deciding fast</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {oneLiners.map((item) => (
                <div key={item.title} className="rounded-sm border border-border bg-canvas p-6">
                  <h3 className="text-body font-medium text-text">{item.title}</h3>
                  <p className="mt-2 text-body-sm text-text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-4">
            <h2 className="text-heading-sm">A calm window, not another tab.</h2>
            <p className="max-w-prose text-body text-text-muted">Same terminal, same agents — they just stop being a scatter of tabs.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/docs/install" className={buttonClass("primary", "md")}>
                Install Bentomux
              </Link>
              <Link href="/docs" className={buttonClass("secondary", "md")}>
                Read the docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
