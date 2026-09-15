/* Small shared presentational pieces: the section header (§9.5), which the five
   bands still share. The app frame and the bullet list went with the mock and
   the feature blocks they were drawn for. */

import type { ReactNode } from "react";

import { cx } from "./cx";

function Overline({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("text-overline text-accent uppercase", className)}>{children}</p>;
}

/** §9.5. `headingId` is what the enclosing region points at with
 *  `aria-labelledby`, so the section name is announced once. */
export function SectionHeader({
  eyebrow,
  heading,
  headingId,
  intro,
  className,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cx("flex max-w-[720px] flex-col gap-4", className)}>
      <Overline>{eyebrow}</Overline>
      <h2 id={headingId} className="text-display-sm">
        {heading}
      </h2>
      {intro ? <p className="text-body-lg max-w-[60ch] text-text-muted">{intro}</p> : null}
    </div>
  );
}
