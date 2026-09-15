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
      className="scroll-mt-nav relative px-4 pt-12 pb-14 lg:px-10 lg:pt-20 lg:pb-20"
    >
      {/* Silhouette mark — large ghosted logo anchored to the right, sits
          behind all content via z-index. No animation per user request. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] lg:block"
        aria-hidden="true"
      >
        <Image
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          className="h-full w-full object-contain object-right opacity-[0.07] mix-blend-screen"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, #000 35%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 35%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[var(--container-max)]">
        <div className="flex w-full flex-col gap-6">
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

          <h1 id="hero-heading" className="text-display max-w-[20ch]">
            {before}
            <em className="not-italic text-accent">{hero.headlineEmphasis}</em>
            {after}
          </h1>

          <p className="max-w-[52ch] text-body-lg text-text-muted">{hero.subheadline}</p>

          <CommandBlock command={command.command} note={hero.quickStartNote} className="w-fit max-w-[52ch] self-start" />

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
      </div>
    </section>
  );
}
