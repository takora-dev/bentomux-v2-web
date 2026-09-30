import { installCommands, installOptions } from "@/content/install";
import { opensInNewTab } from "@/content/chrome";
import { hero, site } from "@/content/site";

import { CommandBlock } from "../install/CommandBlock";

/**
 * IA HERO-001 / §10.3. Ribbon, eyebrow, headline, one paragraph, the install
 * command, and the meta line — copy first, so the whole first screen is text
 * the visitor can act on before any figure loads (LAY-003).
 *
 * No logo here. The mark was a ghosted watermark behind the whole band: at 7%
 * opacity with `mix-blend-screen` on the `#17181b` canvas, the white panes glowed
 * and the black body vanished, so it read as a smudge. An app tile was the second
 * attempt and the header still had to compete with it. The SiteHeader already
 * carries the mark, and the screenshot two scrolls down shows the real thing.
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
      <div className="relative mx-auto w-full max-w-[var(--layout-max)]">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p>
              {/* The ribbon points at the published releases, not at the install
                  band: the beta is out, so the status sentence has a destination
                  that matches it. */}
              <a
                href={site.releasesLatestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-caption text-text-muted transition duration-(--duration-fast) ease-out hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:text-text focus-visible:-translate-y-0.5 focus-visible:border-border-strong focus-visible:bg-surface-hover focus-visible:text-text"
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
          </div>

          <h1 id="hero-heading" className="text-display max-w-[20ch]">
            {before}
            <em className="not-italic text-accent">{hero.headlineEmphasis}</em>
            {after}
          </h1>

          <p className="max-w-[52ch] text-body-lg text-text-muted">{hero.subheadline}</p>

          <CommandBlock command={command.command} note={hero.quickStartNote} className="w-full min-w-0 max-w-[52ch]" />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-caption text-text-subtle">
            <span>
              {platforms} · {site.licenseId}
            </span>
            <a
              href="#install"
              className="text-text-muted underline underline-offset-2 transition-colors duration-(--duration-instant) ease-out hover:text-text"
            >
              all install methods →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
