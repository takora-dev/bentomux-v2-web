import Image from "next/image";

import { headerCopy } from "@/content/chrome";
import { logo } from "@/content/site";

/** §9.15 — first focusable element on the page, a primary button when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:bg-accent focus:text-canvas focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:inline-flex focus:min-h-10 focus:items-center focus:px-4 focus:text-body focus:font-medium focus:rounded-sm"
    >
      {headerCopy.skipToContent}
    </a>
  );
}

export function Logo({
  height = 24,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      <Image
        src={logo.src}
        alt={headerCopy.logoAlt}
        width={logo.width}
        height={logo.height}
        /* The mark is displayed at 24px, so without a size hint Next would
           offer the 1024 and 2048 variants for it (`§10.2`). */
        sizes={`${Math.round((height * logo.width) / logo.height)}px`}
        style={{ height, width: "auto" }}
        priority
      />
    </span>
  );
}
