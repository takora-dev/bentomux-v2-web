import Link from "next/link";

import { headerCopy, opensInNewTab } from "@/content/chrome";
import { navItems, navPrimary } from "@/content/nav";
import { site } from "@/content/site";
import { fetchStarCount } from "@/content/stats";

import { GitHubIcon } from "../ui/icons";
import { Logo } from "./SkipLink";

/**
 * §9.4. Sticky bar: logo, anchors, GitHub, primary action. The primary action
 * is the latest published release (ENT-009 `navPrimary`), so it opens in a new
 * tab like the other external destinations.
 *
 * Two deliberate gaps against the design system, both consequences of building
 * it without JavaScript:
 *  - the scrolled background (`rgba(23,24,27,.92)`) is not applied, so the bar
 *    keeps its rest treatment — NAV-006 only requires it to stay legible, which
 *    the blur plus border does;
 *  - the active-section highlight needs a scroll listener (or IntersectionObserver),
 *    so anchors have no current-page state.
 *
 * The mobile menu is a native `details`, so it works with scripting disabled,
 * which is stricter than the "hide the control, anchors live in the footer"
 * fallback the design system allows.
 */
export async function SiteHeader() {
  const stars = await fetchStarCount();
  const starLabel = stars !== null ? stars.toLocaleString("en-US") : null;
  return (
    <header className="sticky top-0 z-50 h-[60px] border-b border-border bg-[var(--nav-background)] backdrop-blur-[12px]">
      <nav
        aria-label={headerCopy.navLabel}
        className="mx-auto flex h-[60px] w-full max-w-[var(--layout-max)] items-center gap-6 px-4 lg:px-10"
      >
        <Link href="/" aria-label={headerCopy.homeLabel} className="flex items-center gap-2.5 rounded-sm">
          <Logo height={25} className="flex items-center" />
          <span className="font-display text-[20px] font-black tracking-[-0.045em] text-text">{site.siteName.toLowerCase()}</span>
        </Link>
        <span className="flex-1" aria-hidden="true" />
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-caption tracking-[0.07em] uppercase text-text-subtle hover:text-text"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bentomux on GitHub"
            className="inline-flex h-[30px] items-center gap-2 border border-border px-2.5 text-text-subtle hover:border-accent hover:text-accent"
          >
            <GitHubIcon className="size-3.5" />
            {starLabel ? <b className="font-mono text-caption font-normal tabular-nums">{starLabel}</b> : null}
            <span className="sr-only">{opensInNewTab}</span>
          </a>
          <Link href={navPrimary.href} className="inline-flex h-[30px] items-center border border-border px-3.5 text-caption tracking-[0.07em] uppercase text-text hover:border-accent hover:bg-accent hover:text-canvas">
            {navPrimary.label}
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="flex size-[30px] cursor-pointer list-none flex-col items-center justify-center gap-1 border border-border text-text-subtle hover:border-accent hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="block h-px w-3.5 bg-current" />
            <span className="block h-px w-3.5 bg-current" />
            <span className="block h-px w-3.5 bg-current" />
            <span className="sr-only">{headerCopy.openMenuLabel}</span>
          </summary>
          <div className="absolute right-0 top-[38px] w-56 border border-border bg-canvas">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block border-b border-border px-4 py-3.5 text-caption tracking-[0.07em] uppercase text-text"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-b border-border px-4 py-3.5 text-caption text-text-subtle"
            >
              <GitHubIcon className="size-3.5" /> GitHub{starLabel ? ` · ${starLabel}` : ""}
              <span className="sr-only">{opensInNewTab}</span>
            </a>
            <Link href={navPrimary.href} className="block px-4 py-3.5 text-caption tracking-[0.07em] uppercase text-text">
              {navPrimary.label}
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
