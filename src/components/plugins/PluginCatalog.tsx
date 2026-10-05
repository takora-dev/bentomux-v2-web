"use client";

import { useMemo, useState } from "react";

import {
  catalogCopy,
  filterPlugins,
  paginate,
  type PluginListing,
} from "@/content/plugins";
import { opensInNewTab } from "@/content/chrome";

/** Stars and downloads are GitHub's numbers, shown as-is. One decimal place of
 *  a rounded count is still a claim, so the exact integer is printed. */
function count(value: number): string {
  return value.toLocaleString("en-US");
}

function Row({ plugin }: { plugin: PluginListing }) {
  return (
    <li className="flex flex-col gap-3 rounded-sm border border-border bg-canvas-raised p-5 transition-colors hover:border-border-strong sm:flex-row sm:items-start sm:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-body font-medium text-text">{plugin.name}</span>
          {plugin.version ? (
            <span className="font-mono text-caption text-text-subtle">{plugin.version}</span>
          ) : null}
          {!plugin.installable ? (
            <span className="border border-border px-1.5 py-0.5 text-caption text-text-subtle">
              {catalogCopy.notInstallable}
            </span>
          ) : null}
        </div>

        {plugin.description ? (
          <p className="max-w-[70ch] text-body-sm text-text-muted">{plugin.description}</p>
        ) : null}

        <p className="font-mono text-caption text-text-subtle">{plugin.repo}</p>

        {plugin.note ? <p className="text-caption text-warning">{plugin.note}</p> : null}
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:w-56 sm:items-end">
        <span className="inline-flex items-center gap-1.5 text-caption text-text-muted tabular-nums">
          <span title={catalogCopy.stars}>&#9733; {count(plugin.stars)}</span>
          <span className="text-text-subtle">&middot;</span>
          <span title={catalogCopy.downloads}>&darr; {count(plugin.downloads)}</span>
        </span>
        <a
          href={plugin.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption text-accent hover:text-accent-strong"
        >
          {plugin.installable ? "Release" : "Repository"}
          <span className="sr-only">
            {" "}
            {plugin.assetName ? `${plugin.assetName} ` : ""}
            {opensInNewTab}
          </span>
        </a>
        <span className="text-caption text-text-subtle">{catalogCopy.installNote}</span>
      </div>
    </li>
  );
}

/**
 * The catalog list: search over the list already in memory, ten rows a page.
 *
 * The filtering and the clamping are imported from `content/plugins` rather
 * than re-implemented, because the app ships the same two functions and the two
 * surfaces must page identically. Only the query and the page number are state;
 * the rows themselves were fetched at build time and arrive as props, so a
 * visitor's browser never calls GitHub.
 */
export function PluginCatalog({ plugins }: { plugins: readonly PluginListing[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const view = useMemo(
    () => paginate(filterPlugins(plugins, query), page),
    [plugins, query, page],
  );

  if (plugins.length === 0) {
    return (
      <p className="text-body-sm text-text-muted">{catalogCopy.emptyCatalog}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex min-w-0 flex-1 items-center sm:max-w-sm">
          <span className="sr-only">{catalogCopy.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={catalogCopy.searchPlaceholder}
            className="h-10 w-full border border-border bg-canvas px-3 text-body-sm text-text placeholder:text-text-subtle hover:border-border-strong focus-visible:border-accent"
          />
        </label>
        {query.trim() ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPage(0);
            }}
            className="text-caption text-accent hover:text-accent-strong"
          >
            {catalogCopy.clear}
          </button>
        ) : null}
        <span aria-live="polite" className="text-caption text-text-subtle">
          {catalogCopy.inCatalog(view.total)}
        </span>
      </div>

      {view.total === 0 ? (
        <p className="text-body-sm text-text-muted">{catalogCopy.noMatch(query.trim())}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {view.items.map((plugin) => (
            <Row key={plugin.repo} plugin={plugin} />
          ))}
        </ul>
      )}

      {view.pages > 1 ? (
        <nav aria-label="Catalog pages" className="flex items-center gap-4 text-caption">
          <button
            type="button"
            disabled={view.page === 0}
            onClick={() => setPage(view.page - 1)}
            className="text-accent hover:text-accent-strong disabled:text-text-subtle"
          >
            {catalogCopy.previous}
          </button>
          <span className="tabular-nums text-text-subtle">
            {catalogCopy.pageOf(view.page + 1, view.pages)}
          </span>
          <button
            type="button"
            disabled={view.page >= view.pages - 1}
            onClick={() => setPage(view.page + 1)}
            className="text-accent hover:text-accent-strong disabled:text-text-subtle"
          >
            {catalogCopy.next}
          </button>
        </nav>
      ) : null}
    </div>
  );
}
