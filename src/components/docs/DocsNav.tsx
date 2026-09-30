import type { ReactNode } from "react";
import Link from "next/link";

import { docsNav, docsOrder, docsSourcePath, type DocsNavItem } from "@/content/docs";
import { opensInNewTab } from "@/content/chrome";
import { site } from "@/content/site";
import { cx } from "../ui/cx";

import { DocsToc } from "./DocsToc";

/** One row of the sidebar. `aria-current` carries the state; the accent bar is
 *  decoration, so the highlight survives with styling off. */
function NavRow({ item, current }: { item: DocsNavItem; current: string }) {
  const active = item.href === current;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cx(
          "block border-l-2 py-1.5 pl-3 text-body-sm transition-colors duration-(--duration-instant) ease-out",
          active
            ? "border-accent text-text"
            : "border-transparent text-text-muted hover:border-border-strong hover:text-text",
        )}
      >
        {item.title}
      </Link>
    </li>
  );
}

function NavList({ current }: { current: string }) {
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {docsNav.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          <h2 className="mb-1 text-overline tracking-[0.08em] text-text-subtle uppercase">
            {group.label}
          </h2>
          <ul>
            {group.items.map((item) => (
              <NavRow key={item.id} item={item} current={current} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Pagination({ current }: { current: string }) {
  const index = docsOrder.findIndex((item) => item.href === current);
  if (index < 0) return null;
  const previous = docsOrder[index - 1];
  const next = docsOrder[index + 1];
  return (
    <nav
      aria-label="Documentation pages"
      className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.href}
          rel="prev"
          className="flex flex-col gap-1 bg-canvas-raised p-4 hover:bg-surface"
        >
          <span className="text-caption text-text-subtle">← {previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          rel="next"
          className="flex flex-col items-end gap-1 bg-canvas-raised p-4 hover:bg-surface sm:text-right"
        >
          <span className="text-caption text-text-subtle">{next.title} →</span>
        </Link>
      ) : null}
    </nav>
  );
}

/**
 * Three-column documentation frame: grouped sidebar, article, "On this page".
 * The `<main>` lives here rather than in each page so the width, the gutters
 * and the mobile disclosure are written once.
 *
 * The sidebar becomes a native `<details>` below `lg` — it collapses the way a
 * reader expects and works with scripting off, which is why there is no client
 * drawer here. The right column needs script (it reads the rendered headings)
 * and is simply absent below `xl`; the headings themselves stay the only
 * navigation the article requires.
 */
export function DocsShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  const editUrl = `${site.repositoryUrl}/edit/master/${docsSourcePath(current)}`;
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-14 xl:grid-cols-[14rem_minmax(0,1fr)_13rem] xl:gap-12"
    >
      <details className="group mb-8 border-b border-border pb-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-body font-medium [&::-webkit-details-marker]:hidden">
          Menu
          <span aria-hidden="true" className="text-text-subtle group-open:hidden">
            +
          </span>
          <span aria-hidden="true" className="hidden text-text-subtle group-open:inline">
            −
          </span>
        </summary>
        <div className="pt-4">
          <NavList current={current} />
        </div>
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-[84px]">
          <NavList current={current} />
        </div>
      </aside>

      <div className="min-w-0">
        {children}
        <Pagination current={current} />
        <p className="mt-6 text-caption text-text-subtle">
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text hover:underline hover:underline-offset-2"
          >
            Edit this page
            <span className="sr-only"> {opensInNewTab}</span>
          </a>
        </p>
      </div>

      <div className="hidden xl:block">
        <div className="sticky top-[84px]">
          <DocsToc />
        </div>
      </div>
    </main>
  );
}
