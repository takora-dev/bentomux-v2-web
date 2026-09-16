import { statFacts, statStripCopy } from "@/content/stats";

import { StarIcon } from "../ui/icons";

/**
 * IA STR-001 / §9.3. Four figures, three of them owned by this repository and
 * one read from the GitHub API at render time (BR-002.3, ENT-015). The band
 * renders whatever `statFacts` returns: when the API did not answer, the strip
 * is three facts rather than four and nothing is invented to fill the gap.
 */
export function StatStrip({ stars }: { stars: number | null }) {
  const facts = statFacts(stars);

  return (
    <section aria-labelledby="stat-strip-heading" className="px-4 pb-14 lg:px-10 lg:pb-20">
      <h2 id="stat-strip-heading" className="sr-only">
        {statStripCopy.heading}
      </h2>
      <ul className="mx-auto grid w-full max-w-[var(--layout-max)] grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-4">
        {facts.map((fact) => (
          <li key={fact.id} className="bg-canvas-raised">
            <a
              href={fact.href}
              {...(fact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-full items-center gap-3 px-4 py-5 transition-colors duration-instant ease-out hover:bg-surface"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-display text-heading font-extrabold tabular-nums">
                  {fact.value}
                </span>
                <span className="text-caption text-text-subtle">{fact.label}</span>
              </span>
              {fact.icon === "star" ? (
                <StarIcon aria-hidden="true" className="ml-auto size-4 shrink-0 text-text-subtle" />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
