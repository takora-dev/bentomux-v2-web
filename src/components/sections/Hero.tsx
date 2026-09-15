import Image from "next/image";

import { installCommands, installOptions } from "@/content/install";
import { opensInNewTab } from "@/content/chrome";
import { hero, logo, site } from "@/content/site";

import { CommandBlock } from "../install/CommandBlock";

/**
 * IA HERO-001 / §10.3. Ribbon, eyebrow, headline, one paragraph, the install
 * command, and the meta line — copy first, so the whole first screen is text
 * the visitor can act on before any figure loads (LAY-003). From `lg` the band
 * is two columns: the measure on the left, the mark as a watermark on the right.
 */
export function Hero() {
  const command = installCommands.find((candidate) => candidate.id === hero.quickStartCommandId);
  if (!command) {
    throw new Error(
      `[content] hero.quickStartCommandId "${hero.quickStartCommandId}" is not an ENT-005 command`,
    );
  }

  /* The emphasis is a substring of the headline, so the sentence has one
     source: the accent phrase is found in it rather than typed twice. */
  const [before, ...rest] = hero.headline.split(hero.headlineEmphasis);
  const after = rest.join(hero.headlineEmphasis);

  const platforms = installOptions.map((option) => option.label).join(" · ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-nav px-4 pt-12 pb-14 lg:px-10 lg:pt-20 lg:pb-20"
    >
      <div className="mx-auto grid w-full max-w-[var(--container-max)] gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-start lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
        <div className="flex w-full max-w-[62ch] flex-col gap-6">
          <p>
            {/* The ribbon points at the published releases, not at the install
                band: the beta is out, so the status sentence has a destination
                that matches it. */}
            <a
              href={site.releasesLatestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-caption text-text-muted transition-colors duration-instant ease-out hover:bg-surface-hover hover:text-text"
            >
              {hero.badge}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">{opensInNewTab}</span>
            </a>
          </p>

          <p className="flex items-center gap-3 text-overline tracking-[0.08em] text-accent uppercase">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-heading" className="text-display">
            {before}
            <em className="not-italic text-accent">{hero.headlineEmphasis}</em>
            {after}
          </h1>

          <p className="text-body-lg text-text-muted">{hero.subheadline}</p>

          <CommandBlock command={command.command} note={hero.quickStartNote} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-caption text-text-subtle">
            <span>
              {platforms} · {site.licenseId}
            </span>
            <a
              href="#install"
              className="text-text-muted underline underline-offset-2 transition-colors duration-instant ease-out hover:text-text"
            >
              all install methods →
            </a>
          </div>
        </div>

        {/* The mark, decorative: the bar and the footer already name the logo
            with alt text, so this copy carries none and is dropped below `lg`,
            where the text column owns the width.

            Treatment: `screen` sinks the mark's black plate into the canvas and
            leaves only the glyph; the radial mask fades the glyph's edges out
            instead of cutting a rectangle, so there is no hard boundary to
            read as an image box; `mt-24` aligns the mark's top with the h1
            (badge + eyebrow + two `--space-6` gaps), not the column's middle.
            The track is 22rem at `lg` and 30rem at `xl`, where the container is
            at full width and there is room: even at 30rem the 1fr text track
            still clears 62ch, so the headline wraps exactly as before.
            `opacity` is the presence knob — raise it if the mark reads too
            faint, drop it if it starts competing with the headline. The glow
            behind is one accent-tint radial, the same alpha the selection
            colour uses; its `-inset-8` bleed stays inside the 40px desktop
            gutter (LAY-002). `hero-mark` breathes the glyph (keyframes in
            `globals.css`); it is a documented exception to MOT-002, which
            otherwise forbids ambient motion, and it collapses under
            `prefers-reduced-motion` per MOT-003. The mark's source is 1024px
            wide so the 480px `xl` track clears 2× on a retina screen — a
            narrower raster is why this watermark looked soft. */}
        <div
          className="relative hidden self-start lg:mt-24 lg:block xl:mt-0"
          aria-hidden="true"
        >
          <div className="absolute -inset-8 bg-[radial-gradient(circle,var(--color-accent-tint),transparent_70%)]" />
          <Image
            src={logo.src}
            alt=""
            width={logo.width}
            height={logo.height}
            sizes="(min-width: 1280px) 480px, (min-width: 1024px) 288px, 100vw"
            className="hero-mark relative h-auto w-full opacity-[0.22] mix-blend-screen"
            style={{
              maskImage: "radial-gradient(circle at 50% 48%, #000 38%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 48%, #000 38%, transparent 76%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
