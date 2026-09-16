import { commandsForPanel, installCopy, installOptions, manualDownloads } from "@/content/install";
import { installExtras, sections } from "@/content/sections";

import { CopyButton } from "../install/CopyButton";
import { SectionHeader } from "../ui/primitives";

const copy = sections.find((section) => section.id === "install")!;

/**
 * §9.9–§9.10. All three panels are in the server-rendered HTML; the checked
 * native radio decides which one is visible (FR-005.6), macOS is checked on the
 * server (FR-005.2), and nothing animates on switch (MOT-002).
 */
export function InstallSection() {
  return (
    <section
      id="install"
      aria-labelledby="install-heading"
      className="scroll-mt-nav px-4 border-t border-border py-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-12">
        <SectionHeader
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          headingId="install-heading"
          intro={copy.intro}
        />

        <fieldset className="install-switcher relative min-w-0 w-full">
          <legend className="sr-only">{installCopy.platformLegend}</legend>

          {installOptions.map((option) => (
            <input
              key={option.id}
              id={`install-tab-${option.id}`}
              className="install-option-input"
              type="radio"
              name="install-platform"
              defaultChecked={option.isDefault}
            />
          ))}

          <div className="install-tabs inline-flex gap-1 rounded-sm border border-border p-1 max-md:w-full max-md:flex-col">
            {installOptions.map((option) => (
              <label
                key={option.id}
                htmlFor={`install-tab-${option.id}`}
                className="install-option-label"
              >
                {option.label}
              </label>
            ))}
          </div>

          <div className="install-panels mt-8">
            {installOptions.map((option) => (
              <div key={option.id} id={`install-panel-${option.id}`} className="install-panel">
                <div className="flex flex-col gap-6">
                  {commandsForPanel(option.id).map((command) => (
                    <figure key={command.id} aria-labelledby={`${command.id}-caption`} className="min-w-0">
                      {command.kind === "pin" ? (
                        <p className="mb-2 text-caption text-text-subtle">
                          {installExtras.pinLabel}
                        </p>
                      ) : null}
                      <div className="block w-full min-w-0 max-w-full overflow-x-auto rounded-sm border border-border bg-surface">
                        <code className="block w-max px-4 py-3 font-mono text-mono whitespace-pre text-text">
                          {command.command}
                        </code>
                      </div>
                      <figcaption
                        id={`${command.id}-caption`}
                        className="mt-2 flex flex-wrap items-center justify-between gap-3"
                      >
                        <span className="text-caption text-text-subtle">{command.caption}</span>
                        <CopyButton text={command.command} />
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-text-muted">
            {manualDownloads.label} {manualDownloads.sentence.before}
            {manualDownloads.formats.join(", ")}
            {manualDownloads.sentence.between}
            <a
              href={manualDownloads.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent-strong"
            >
              {manualDownloads.sentence.link}
            </a>
            {manualDownloads.sentence.after}
          </p>
        </div>
      </div>
    </section>
  );
}
