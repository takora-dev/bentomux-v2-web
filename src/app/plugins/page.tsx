import type { Metadata } from "next";
import Link from "next/link";

import { PluginCatalog } from "@/components/plugins/PluginCatalog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { buttonClass, proseLinkClass } from "@/components/ui/Button";
import { opensInNewTab } from "@/content/chrome";
import { site } from "@/content/site";
import {
  TOPIC,
  catalogCopy,
  catalogLimits,
  fetchCatalog,
  installSteps,
  pluginsPage,
  pluginLinks,
  publishSteps,
  tagRule,
  type GuidanceStep,
} from "@/content/plugins";

export const metadata: Metadata = {
  title: "Plugins",
  description: `Community plugins for Bentomux, discovered from the GitHub topic ${TOPIC} and listed most-starred first. Install from the app, or publish your own.`,
  alternates: { canonical: "/plugins" },
  openGraph: {
    title: `Plugins — ${site.siteName}`,
    description: `Community plugins discovered from the GitHub topic ${TOPIC}, most-starred first.`,
    url: "/plugins",
  },
};

/** One numbered guidance row. `command` is quoted text, never executed by the
 *  page — the app is what installs, and the site has no download button on
 *  purpose. */
function Step({ step }: { step: GuidanceStep }) {
  return (
    <div className="flex gap-6">
      <span className="shrink-0 font-mono text-mono text-accent">{step.n}</span>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-body font-medium text-text">{step.title}</h3>
        <p className="max-w-prose text-body-sm text-text-muted">{step.body}</p>
        {step.command ? (
          <pre className="overflow-x-auto rounded-sm border border-border bg-canvas-raised px-4 py-3 text-mono text-text">
            {step.command}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

/**
 * PAGE-004 / IA — the public marketplace index.
 *
 * The catalog is read once, at build time (`fetchCatalog`), and prerendered:
 * unauthenticated GitHub allows 60 core and 10 search requests an hour per IP,
 * so a per-visitor fetch would hand the visitor a rate-limit error instead of a
 * list. Search and paging run in the browser over that prerendered list, which
 * is exactly what the app does with its own six-hour cache.
 *
 * When GitHub does not answer, the list is empty and the page says so and sends
 * the visitor to the live topic search — an honest empty state rather than a
 * stale or invented row.
 */
export default async function PluginsPage() {
  const catalog = await fetchCatalog();

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <section className="px-4 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-6">
            <p className="text-overline text-accent uppercase">{pluginsPage.eyebrow}</p>
            <h1 className="max-w-[18ch] text-display-sm">{pluginsPage.heading}</h1>
            <p className="max-w-prose text-body-lg text-text-muted">{pluginsPage.intro}</p>
            <p className="max-w-prose text-body-sm text-text-subtle">
              {pluginsPage.caution}{" "}
              <Link href={pluginsPage.cautionHref} className={proseLinkClass()}>
                {pluginsPage.cautionLabel}
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/docs/plugins" className={buttonClass("primary", "md")}>
                Write a plugin
              </Link>
              <a
                href={pluginLinks.topicSearch}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary", "md")}
              >
                Live topic search
                <span className="sr-only">{opensInNewTab}</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="catalog"
          aria-labelledby="catalog-heading"
          className="scroll-mt-nav border-t border-border bg-canvas-raised px-4 py-16 lg:px-10 lg:py-20"
        >
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 id="catalog-heading" className="text-heading-sm">
                {catalogCopy.heading}
              </h2>
              <p className="text-body-sm text-text-muted">{catalogCopy.subheading}</p>
              <p className="font-mono text-caption text-text-subtle">
                topic:{TOPIC} · most-starred first, repo name breaking ties
              </p>
            </div>

            {catalog.note ? (
              <p className="max-w-prose text-body-sm text-text-muted">{catalog.note}</p>
            ) : null}

            <PluginCatalog plugins={catalog.plugins} />

            <p className="text-caption text-text-subtle">
              {catalog.live
                ? "Read from GitHub when this page was built. The app re-reads it on every open, and its copy is at most six hours old."
                : "The app re-reads GitHub on every open; this page's copy is built from whatever the last build could read."}
            </p>
          </div>
        </section>

        <section aria-labelledby="install-heading" className="border-t border-border px-4 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            <h2 id="install-heading" className="text-heading-sm">
              Install from the app
            </h2>
            {installSteps.map((step) => (
              <Step key={step.n} step={step} />
            ))}
          </div>
        </section>

        <section
          id="publish"
          aria-labelledby="publish-heading"
          className="scroll-mt-nav border-t border-border bg-canvas-raised px-4 py-16 lg:px-10 lg:py-20"
        >
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-overline text-accent uppercase">Publish</p>
              <h2 id="publish-heading" className="text-heading-sm">
                Get your plugin listed
              </h2>
              <p className="max-w-prose text-body-sm text-text-muted">
                GitHub is the catalog: the topic makes a repository discoverable and the release is what makes it
                installable. Both are required, and there is no submission form, account or review queue.
              </p>
            </div>

            {publishSteps.map((step) => (
              <Step key={step.n} step={step} />
            ))}

            <div className="flex flex-col gap-2 border border-border bg-canvas p-5">
              <h3 className="text-body font-medium text-text">{tagRule.label}</h3>
              <p className="max-w-prose text-body-sm text-text-muted">{tagRule.body}</p>
            </div>

            <p className="text-body-sm text-text-muted">
              The full publishing reference — digests, the archive layout, troubleshooting — lives in the
              application repository&apos;s{" "}
              <a
                href={`${site.repositoryUrl}/blob/master/docs/PLUGIN_MARKETPLACE.md`}
                target="_blank"
                rel="noopener noreferrer"
                className={proseLinkClass()}
              >
                PLUGIN_MARKETPLACE.md
                <span className="sr-only">{opensInNewTab}</span>
              </a>
              . The plugin platform itself — manifest, permissions, contribution points — is documented on this
              site&apos;s{" "}
              <Link href="/docs/plugins" className={proseLinkClass()}>
                plugins page
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="limits-heading" className="border-t border-border px-4 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-8">
            <h2 id="limits-heading" className="text-heading-sm">
              {catalogLimits.heading}
            </h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              {catalogLimits.rows.map((row) => (
                <div key={row.id} className="flex flex-col gap-2 rounded-sm border border-border bg-canvas-raised p-5">
                  <dt className="font-mono text-caption text-accent">{row.label}</dt>
                  <dd className="max-w-prose text-body-sm text-text-muted">{row.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
