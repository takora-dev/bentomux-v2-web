"use client";

import { useEffect, useRef, useState } from "react";

import { installCopy } from "@/content/install";

import { CopyIcon } from "../ui/icons";

type State = keyof typeof installCopy.copy;

const labels = installCopy.copy;

/**
 * §9.10 CPY-001–CPY-003. The control is never the only route to the command:
 * the text stays selectable and the feedback is text inside the block's region.
 */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="copy-control inline-flex min-h-11 items-center gap-2 rounded-sm bg-surface px-3 text-body-sm text-text-muted transition-colors duration-instant ease-out hover:bg-surface-hover hover:text-text md:min-h-8"
      aria-live={state === "idle" ? undefined : "polite"}
    >
      <CopyIcon className="size-4" />
      {labels[state]}
    </button>
  );
}
