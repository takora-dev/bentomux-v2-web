import {
  commandsForPanel,
  installCopy,
  installOptions,
  installerSteps,
  manualDownloads,
  platformDetectionScript,
} from "@/content/install";
import { installExtras, sections } from "@/content/sections";

import { CopyButton } from "../install/CopyButton";
import { cx } from "../ui/cx";
import { WarningIcon } from "../ui/icons";
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
      className="scroll-mt-nav px-4 py-16 lg:px-10 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-12">
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
                      <div className="overflow-x-auto rounded-sm border border-border bg-surface">
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

                  {option.id === "linux" ? (
                    <p className="text-body-sm text-text-muted">{installExtras.linuxArchNote}</p>
                  ) : null}

                  {option.notes.map((note) => {
                    const isWarning = option.id === "macos";
                    return (
                      <p
                        key={note}
                        className={cx(
                          "flex items-start gap-2 text-body-sm",
                          isWarning ? "text-warning" : "text-text-muted",
                        )}
                      >
                        {isWarning ? (
                          <WarningIcon className="mt-0.5 size-4 shrink-0" />
                        ) : null}
                        {note}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-4 border-t border-border pt-8">
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
          <ol className="flex flex-col gap-2">
            {installerSteps.map((step) => (
              <li key={step.id} className="text-body-sm text-text-muted">
                {step.text}
              </li>
            ))}
          </ol>
        </div>

        {/* FR-005.4 / TC-F005-014: detection runs while the document is parsed,
            once, before any interaction — so it can never override a selection
            the visitor has already made. */}
        <script dangerouslySetInnerHTML={{ __html: platformDetectionScript }} />
      </div>
    </section>
  );
}
