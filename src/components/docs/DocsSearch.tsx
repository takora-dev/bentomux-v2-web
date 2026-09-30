"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import records from "@/content/docs-search.json";

interface Section {
  u: string;
  t: string;
  h: string;
  a: string;
  x: string;
}

const corpus = records as Section[];

/* ponytail: substring + prefix scoring, no index and no dependency. Ten pages
   is a few dozen KB — this scans in well under a millisecond. Swap for
   FlexSearch/Pagefind if the docs grow past a few hundred pages or people start
   typing half-remembered, misspelled words. */
function search(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const hits: { url: string; title: string; heading: string; snippet: string; score: number }[] = [];
  for (const record of corpus) {
    const heading = record.h.toLowerCase();
    const body = record.x.toLowerCase();
    let score = 0;
    let at = -1;
    for (const term of terms) {
      if (heading.startsWith(term)) score += 16;
      else if (heading.includes(term)) score += 10;
      else {
        const position = body.indexOf(term);
        if (position < 0) {
          score = 0;
          break;
        }
        score += 3;
        if (at < 0) at = position;
      }
    }
    if (score === 0) continue;

    /* Prefer the match nearest the opening of the section over one buried at the
       end, and prefer the short heading over the rambling one. */
    const rank = score - (at > 0 ? Math.min(at, 400) / 100 : 0) + Math.min(heading.length, 60) / 1000;
    hits.push({
      url: record.a ? `${record.u}#${record.a}` : record.u,
      title: record.t,
      heading: record.h,
      snippet: snippet(record.x, at),
      score: rank,
    });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 12);
}

function snippet(body: string, at: number) {
  if (at < 0) return body.slice(0, 140);
  const start = Math.max(0, at - 60);
  return `${start > 0 ? "…" : ""}${body.slice(start, start + 160)}`;
}

function Marked({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, index) =>
        terms.includes(part.toLowerCase()) ? (
          <mark key={index} className="bg-accent-tint text-text">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Documentation search over the corpus `scripts/docs-search.mjs` cut out of the
 * prerendered articles. Rendered in the site bar but only on /docs, where the
 * results are about something on screen.
 */
export function DocsSearch() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);
  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/docs")) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pathname]);

  if (!pathname.startsWith("/docs")) return null;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="hidden h-[30px] items-center gap-2 border border-border px-2.5 text-caption text-text-subtle hover:border-accent hover:text-accent md:inline-flex"
      >
        <SearchIcon />
        Search
        <kbd className="font-mono text-[10px] tracking-wider">⌘K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setQuery("")}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="docs-search-dialog m-auto w-[min(42rem,92vw)] rounded-lg border border-border bg-canvas-raised p-0 text-text backdrop:bg-black/60"
      >
        <div className="border-b border-border p-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && results[0]) {
                event.preventDefault();
                dialogRef.current?.close();
                router.push(results[0].url);
              }
            }}
            type="search"
            placeholder="Search the documentation…"
            aria-label="Search the documentation"
            className="w-full bg-transparent text-body outline-none placeholder:text-text-subtle"
          />
        </div>

        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <li className="px-2 py-6 text-center text-body-sm text-text-subtle">
              {corpus.length} sections indexed.
            </li>
          ) : results.length === 0 ? (
            <li className="px-2 py-6 text-center text-body-sm text-text-subtle">
              Nothing matches “{query}”.
            </li>
          ) : (
            results.map((result) => (
              <li key={result.url}>
                <a
                  href={result.url}
                  onClick={() => dialogRef.current?.close()}
                  className="flex flex-col gap-0.5 rounded-sm px-2 py-2 hover:bg-surface"
                >
                  <span className="text-caption text-text-subtle">{result.title}</span>
                  <span className="text-body-sm text-text">
                    <Marked text={result.heading || result.title} terms={terms} />
                  </span>
                  <span className="truncate text-caption text-text-subtle">
                    <Marked text={result.snippet} terms={terms} />
                  </span>
                </a>
              </li>
            ))
          )}
        </ul>
      </dialog>
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" strokeLinecap="round" />
    </svg>
  );
}
