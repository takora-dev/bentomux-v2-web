import Link from "next/link";

import { headerCopy, opensInNewTab } from "@/content/chrome";
import { navExternal, navItems, navPrimary } from "@/content/nav";
import { site } from "@/content/site";

import { buttonClass } from "../ui/Button";
import { cx } from "../ui/cx";
import { ChevronIcon, GitHubIcon } from "../ui/icons";
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
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--nav-background)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-nav w-full max-w-[var(--container-max)] items-center gap-4 px-4 lg:px-10">
        <Link
          href="/"
          aria-label={headerCopy.homeLabel}
          className="flex items-center gap-2 rounded-sm"
        >
          <Logo height={24} className="flex items-center" />
          {/* §10.2: wordmark is `--font-display` at 800 weight, beside the mark. */}
          <span className="font-display text-heading-sm font-extrabold">{site.siteName}</span>
        </Link>

        <nav aria-label={headerCopy.navLabel} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={buttonClass("ghost", "sm")}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={navExternal.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("ghost", "sm", "gap-1.5")}
              >
                <GitHubIcon className="size-4" />
                {navExternal.label}
                <span className="sr-only">{opensInNewTab}</span>
              </a>
            </li>
          </ul>
        </nav>

        <a
          href={navPrimary.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "sm", "ml-auto md:ml-0")}
        >
          {navPrimary.label}
          <span className="sr-only">{opensInNewTab}</span>
        </a>

        <details className="group relative md:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-sm text-text-muted hover:text-text [&::-webkit-details-marker]:hidden">
            <span className="sr-only">{headerCopy.openMenuLabel}</span>
            <ChevronIcon className="size-5 transition-transform duration-instant ease-out group-open:rotate-180" />
          </summary>
          <nav
            aria-label={headerCopy.navLabel}
            className="menu-panel absolute right-0 mt-2 w-56 rounded-sm border border-border bg-surface p-2"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={cx(
                      "flex min-h-11 items-center rounded-sm px-3 text-body text-text-muted",
                      "hover:bg-surface-hover hover:text-text",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={navExternal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-sm px-3 text-body text-text-muted hover:bg-surface-hover hover:text-text"
                >
                  <GitHubIcon className="size-4" />
                  {navExternal.label}
                  <span className="sr-only">{opensInNewTab}</span>
                </a>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
