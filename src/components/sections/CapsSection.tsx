import { capabilities, type CapEvidence } from "@/content/caps";
import { sections } from "@/content/sections";

import { cx } from "../ui/cx";

const copy = sections.find((section) => section.id === "capabilities")!;

const STATE_DOT = {
  working: "bg-success",
  blocked: "bg-warning",
  idle: "bg-text-subtle",
} as const;

const TONE = {
  muted: "text-text-subtle",
  warn: "text-warning",
  ok: "text-success",
} as const;

/** One row's right column (§9.6 CAP-002). Every panel is the same box: hairline border,
 *  raised surface, monospace rows. The five panels differ only in what they
 *  quote, so the eye can compare them down the column. */
function EvidencePanel({ evidence }: { evidence: CapEvidence }) {
  const box = "flex flex-col gap-2 rounded-sm border border-border bg-canvas-raised p-4";

  if (evidence.kind === "tabs") {
    return (
      <div className={box}>
        {evidence.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-mono text-text">{row.label}</span>
            <span className="text-caption text-text-subtle">{row.note}</span>
          </div>
        ))}
      </div>
    );
  }

  if (evidence.kind === "states") {
    return (
      <div className={box}>
        {evidence.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", STATE_DOT[row.state])} />
            <span className="font-mono text-mono text-text">{row.label}</span>
            <span className="text-caption text-text-muted">{row.state}</span>
            <span className="ml-auto text-caption text-text-subtle">{row.note}</span>
          </div>
        ))}
      </div>
    );
  }

  if (evidence.kind === "approval") {
    return (
      <div className={cx(box, "font-mono text-mono")}>
        {evidence.lines.map((line, index) => (
          <p key={`${line.text}-${index}`} className={TONE[line.tone ?? "muted"] ?? "text-text"}>
            {line.text}
          </p>
        ))}
      </div>
    );
  }

  if (evidence.kind === "runtimes") {
    return (
      <div className={box}>
        <ul className="flex flex-wrap gap-2">
          {evidence.names.map((name) => (
            <li
              key={name}
              className="rounded-sm border border-border bg-surface px-2 py-1 font-mono text-caption text-text-muted"
            >
              {name}
            </li>
          ))}
        </ul>
        <p className="text-caption text-text-subtle">{evidence.note}</p>
      </div>
    );
  }

  return (
    <div className={box}>
      <p className="font-mono text-mono text-accent-strong">{evidence.address}</p>
      {evidence.rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-mono text-text">{row.label}</span>
          <span className="text-caption text-text-subtle">{row.note}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * SEC-013 five numbered rows, each one claim with the evidence panel that
 * carries it (BR-002.1). The heading is visually hidden: the rows are the band,
 * and a title above row 01 would only repeat it.
 */
export function CapsSection() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="scroll-mt-nav border-t border-border px-4 py-16 lg:px-10 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col">
        <h2 id="capabilities-heading" className="sr-only">
          {copy.heading}
        </h2>

        <ol className="flex flex-col">
          {capabilities.map((capability) => (
            <li
              key={capability.id}
              id={`cap-${capability.id}`}
              className="grid gap-6 border-b border-border py-10 first:border-t lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-12 lg:py-14"
            >
              <div className="flex max-w-[62ch] flex-col gap-4">
                <p className="font-mono text-mono text-text-subtle tabular-nums">{capability.number}</p>
                <h3 className="text-heading">{capability.title}</h3>
                <p className="text-body text-text-muted">{capability.body}</p>
              </div>
              <EvidencePanel evidence={capability.evidence} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
