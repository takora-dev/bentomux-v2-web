import type { Metadata } from "next";
import Link from "next/link";

import { docsCards, docsCopy, docsPaths } from "@/content/docs";
import { site } from "@/content/site";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Documentation",
  description: docsCopy.intro,
  alternates: { canonical: "/docs" },
  openGraph: {
    title: `Documentation — ${site.siteName}`,
    description: docsCopy.intro,
    url: "/docs",
  },
};

export default function DocsIndexPage() {
  return (
    <main id="main" className="flex flex-1 flex-col px-4 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-12">
        <header className="flex max-w-[60ch] flex-col gap-4">
          <p className="text-overline text-accent uppercase">{docsCopy.eyebrow}</p>
          <h1 className="text-display-sm">{docsCopy.heading}</h1>
          <p className="max-w-[60ch] text-body-lg text-text-muted">{docsCopy.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={docsPaths.install} className={buttonClass("primary", "md")}>
              Install Bentomux
            </Link>
            <Link href={docsPaths.quickStart} className={buttonClass("secondary", "md")}>
              Quick start
            </Link>
          </div>
        </header>

        <section aria-labelledby="pick-path-heading" className="flex flex-col gap-6">
          <h2 id="pick-path-heading" className="text-heading-sm">
            Pick your path
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-sm border border-border bg-canvas-raised p-6">
              <h3 className="text-body font-medium text-text">New to terminal multiplexers?</h3>
              <p className="mt-2 text-body-sm text-text-muted">
                You don&apos;t need to learn shortcuts to start. Split, drag and switch from the
                UI — keyboard comes later, when you want it.
              </p>
              <p className="mt-4">
                <Link href={docsPaths.quickStart} className="text-caption text-accent hover:text-accent-strong">
                  Quick start →
                </Link>
              </p>
            </div>
            <div className="rounded-sm border border-border bg-canvas-raised p-6">
              <h3 className="text-body font-medium text-text">Coming from tmux or zellij?</h3>
              <p className="mt-2 text-body-sm text-text-muted">
                The model is familiar — panes persist, detach and reattach work the way you expect.
              </p>
              <p className="mt-4 flex flex-wrap gap-3 text-caption">
                <Link href={docsPaths.quickStart} className="text-accent hover:text-accent-strong">
                  Quick start →
                </Link>
                <Link href={docsPaths.configuration} className="text-accent hover:text-accent-strong">
                  Keybindings →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docsCards.map((card) => (
            <li key={card.id}>
              <Link
                href={card.href}
                className="flex h-full flex-col gap-2 rounded-sm border border-border bg-canvas-raised p-6 transition-colors hover:border-border-strong hover:bg-surface"
              >
                <span className="text-body font-medium text-text">{card.title}</span>
                <span className="text-body-sm text-text-muted">{card.body}</span>
                <span className="mt-auto pt-2 text-caption text-accent">{card.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
