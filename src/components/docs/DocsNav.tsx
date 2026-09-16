import Link from "next/link";

import { docsPaths } from "@/content/docs";
import { cx } from "../ui/cx";

const links: readonly { href: string; label: string }[] = [
  { href: "/docs", label: "Overview" },
  { href: docsPaths.install, label: "Install" },
  { href: docsPaths.quickStart, label: "Quick start" },
  { href: docsPaths.agents, label: "Agents" },
  { href: docsPaths.configuration, label: "Configuration" },
  { href: docsPaths.connectingMachines, label: "Connecting machines" },
  { href: docsPaths.sessionState, label: "Session state" },
  { href: docsPaths.socketApi, label: "API" },
  { href: docsPaths.plugins, label: "Plugins" },
  { href: docsPaths.marketplace, label: "Marketplace" },
];

export function DocsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.href === current;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "rounded-sm px-3 py-2 text-body-sm",
              active ? "bg-surface text-text" : "text-text-muted hover:text-text hover:bg-surface",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DocsShell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-10 lg:flex-row lg:gap-12">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-20">
          <DocsNav current={current} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
