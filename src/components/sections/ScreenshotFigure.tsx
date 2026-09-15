import Image from "next/image";

import { screenshotCopy } from "@/content/screenshot";

/**
 * IA FIG-001 / §10.4. The figure band: a label above the frame, the capture of
 * the application window inside it, and one caption below. The image is the
 * page's one picture of the product (IMG-001); it declares its own dimensions,
 * so it reserves its box before it loads and cannot shift the page.
 */
export function ScreenshotFigure() {
  return (
    <section aria-labelledby="screenshot-heading" className="px-4 pb-16 lg:px-10 lg:pb-24">
      <figure className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="screenshot-heading"
            className="text-overline tracking-[0.08em] text-text-muted uppercase"
          >
            {screenshotCopy.bandHeading}
          </h2>
          <span className="text-caption text-text-subtle">{screenshotCopy.bandHint}</span>
        </div>

        {/* Below `md` the capture is cropped from its top-left corner rather than
            scaled down to an unreadable width; from `md` up it renders at its
            own aspect ratio. */}
        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            src="/screenshot.png"
            alt={screenshotCopy.alt}
            width={2982}
            height={1974}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-[220px] w-full object-cover object-left-top md:h-auto"
          />
        </div>

        <figcaption className="text-caption text-text-subtle">{screenshotCopy.caption}</figcaption>
      </figure>
    </section>
  );
}
