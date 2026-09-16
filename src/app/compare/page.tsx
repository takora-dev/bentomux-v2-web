import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Compare",
  description: "How Bentomux compares to terminal tabs, tmux and other agent managers.",
  alternates: { canonical: "/compare" },
};

const oneLiners: readonly { title: string; body: string }[] = [
  {
    title: "Bentomux vs terminal tabs",
    body: "Tabs are throwaway. Bentomux keeps layout, named panes and session restore in one native window.",
  },
  {
    title: "Bentomux vs tmux",
    body: "tmux keeps terminals alive — so does Bentomux. The difference is a native GUI with zero config, focus mode and one-click output copy.",
  },
  { title: "Bentomux vs manager apps", body: "Manager apps put worktrees and review queues in a window. Bentomux is the window itself." },
] as const;

const notes: readonly { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "A window, not tabs in a terminal.",
    body: "Bentomux is a native app — layout, panes and split borders persist as UI, not as a terminal you have to configure.",
  },
  { n: "02", title: "Persists without config.", body: "Reopen the app and the same window is back — no tmux.conf, no plugin, no rescue script." },
  { n: "03", title: "Built for agents.", body: "Every pane is a real PTY built to run a coding agent side-by-side, with approval handling and live state." },
  { n: "04", title: "Keyboard-first, mouse-friendly.", body: "Every action reachable without a mouse — drag and click still work when you want them." },
  { n: "05", title: "Free and open source.", body: "MIT licensed. Inspect, fork, contribute." },
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
              Most alternatives are either raw terminal tabs or a multiplexer you configure yourself. Bentomux is a
              native window built to hold agents side-by-side.
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
