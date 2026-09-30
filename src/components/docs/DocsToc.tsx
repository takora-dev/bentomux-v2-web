"use client";

import { useEffect, useState } from "react";

import { cx } from "../ui/cx";

interface Entry {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

/** Slug with a per-page counter, so two headings that reduce to the same text
 *  ("Install" under two sections) still get distinct anchors. */
function slugify(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const seenCount = seen.get(base) ?? 0;
  seen.set(base, seenCount + 1);
  return seenCount ? `${base}-${seenCount}` : base;
}

/**
 * "On this page", read off the rendered article instead of a second declaration
 * of the headings in the content layer. The pages are hand-written TSX, so the
 * DOM is the only list that cannot go stale — a `headings` array beside each
 * article would be a second thing to forget when a section is renamed.
 *
 * Script is the whole feature: without it the right column simply is not
 * rendered and the article still reads top to bottom, which is why the
 * headings themselves are not the only route to any section.
 */
export function DocsToc() {
  const [entries, setEntries] = useState<readonly Entry[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector("main article");
    if (!article) return;

    const seen = new Map<string, number>();
    const found: Entry[] = [];
    const nodes: Element[] = [];

    for (const element of Array.from(article.querySelectorAll("h2, h3"))) {
      const text = element.textContent?.trim() ?? "";
      if (!text) continue;
      const id = slugify(text, seen);
      element.id = id;
      found.push({ id, text, level: element.tagName === "H2" ? 2 : 3 });
      nodes.push(element);
    }
    /* The article only exists once the browser has it, so the first render has
       to be empty and this read cannot move into render. The rule wants state
       derived during render; here the source is the document, not props. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(found);

    /* A band across the top of the viewport: whichever heading last crossed it
       is the section being read. `-70%` keeps the lower band empty so a heading
       only wins once it is genuinely the topmost one on screen. */
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (entries.length < 2) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <h2 className="text-overline tracking-[0.08em] text-text-subtle uppercase">On this page</h2>
      <ul className="flex flex-col gap-0.5 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? "true" : undefined}
              className={cx(
                "block border-l-2 py-1 pl-3 text-caption leading-snug transition-colors duration-(--duration-instant) ease-out",
                entry.level === 3 && "pl-6",
                active === entry.id
                  ? "-ml-px border-accent text-text"
                  : "-ml-px border-transparent text-text-muted hover:border-border-strong hover:text-text",
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
