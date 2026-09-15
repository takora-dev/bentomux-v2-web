import { CopyButton } from "../install/CopyButton";
import { cx } from "../ui/cx";

/**
 * §9.11. One command, quoted once, with the copy control beside it. The command
 * text stays selectable and readable without JavaScript; only the control needs
 * scripting, and it hides itself when there is none (CPY-003).
 */
export function CommandBlock({
  command,
  note,
  className,
}: {
  command: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-2 rounded-sm border border-border",
        "bg-surface px-4 py-3",
        className,
      )}
    >
      <div className="flex items-start gap-x-4">
        <code className="font-mono text-mono text-text">
          <span aria-hidden="true" className="text-text-subtle">
            ${" "}
          </span>
          {command}
        </code>
        <CopyButton text={command} />
      </div>
      {note ? <span className="text-caption text-text-subtle">{note}</span> : null}
    </div>
  );
}
