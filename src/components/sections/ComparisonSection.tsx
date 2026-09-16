import { comparisonCopy, comparisonRows, type ComparisonValue } from "@/content/comparison";

import { cx } from "../ui/cx";
import { SectionHeader } from "../ui/primitives";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("size-4 shrink-0", className)}
    >
      <polyline points="2.5,8.5 6,12 13.5,4" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={cx("size-4 shrink-0", className)}
    >
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  );
}

function Cell({ value, highlight }: { value: ComparisonValue; highlight?: boolean }) {
  if (value === true) {
    return (
      <span
        className={cx(
          "inline-flex items-center gap-1.5",
          highlight ? "text-accent" : "text-text-muted",
        )}
      >
        <CheckIcon />
        <span className="sr-only">{comparisonCopy.legend.yes}</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-text-subtle">
        <CrossIcon />
        <span className="sr-only">{comparisonCopy.legend.no}</span>
      </span>
    );
  }
  return <span className="text-caption text-text-subtle">{value}</span>;
}

const thClass = cx(
  "py-3 px-4 text-left text-overline text-text-subtle uppercase font-normal",
  "border-b border-border bg-canvas-raised",
);

const tdClass = "py-4 px-4 text-body-sm text-text align-top";

export function ComparisonSection() {
  return (
    <section
      aria-labelledby="comparison-heading"
      className="border-t border-border px-4 py-16 lg:px-10 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-12">
        <SectionHeader
          eyebrow={comparisonCopy.eyebrow}
          heading={comparisonCopy.heading}
          headingId="comparison-heading"
          intro={comparisonCopy.intro}
        />

        <div className="w-full overflow-x-auto rounded-sm border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th scope="col" className={cx(thClass, "w-[46%]")}>
                  Feature
                </th>
                <th scope="col" className={cx(thClass, "w-[18%] text-accent")}>
                  {comparisonCopy.columns.bentomux}
                </th>
                <th scope="col" className={cx(thClass, "w-[18%]")}>
                  {comparisonCopy.columns.terminalTabs}
                </th>
                <th scope="col" className={cx(thClass, "w-[18%]")}>
                  {comparisonCopy.columns.tmux}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cx(
                    index !== comparisonRows.length - 1 && "border-b border-border",
                    "hover:bg-surface transition-colors duration-instant ease-out",
                  )}
                >
                  <th scope="row" className={cx(tdClass, "font-normal")}>
                    <span className="text-body-sm text-text">{row.feature}</span>
                    {row.description ? (
                      <span className="mt-0.5 block text-caption text-text-subtle">
                        {row.description}
                      </span>
                    ) : null}
                  </th>
                  <td className={tdClass}>
                    <Cell value={row.bentomux} highlight />
                  </td>
                  <td className={tdClass}>
                    <Cell value={row.terminalTabs} />
                  </td>
                  <td className={tdClass}>
                    <Cell value={row.tmux} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
