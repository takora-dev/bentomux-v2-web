/* Button — design system §9.1. Exported as a class builder rather than a
   polymorphic component: every call site already knows whether it renders an
   anchor, a Next link or a button, and a wrapper would only hide that.

   Variants are exactly the four specified; `danger` ships for completeness but
   has no v1 call site. */

import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium " +
  "transition-colors duration-instant ease-out active:translate-y-px " +
  /* BTN-002: 44px touch target below md, where button height alone is not enough. */
  "min-h-11 md:min-h-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-canvas hover:bg-accent-hover",
  secondary: "bg-surface text-text border border-border hover:bg-surface-hover",
  ghost: "text-text-muted hover:text-text hover:bg-tint",
  danger: "text-danger border border-danger hover:bg-tint",
};

const sizes: Record<ButtonSize, string> = {
  sm: "md:h-8 px-3 text-body-sm",
  md: "md:h-10 px-4 text-body",
  lg: "md:h-12 px-6 text-body-lg",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cx(base, variants[variant], sizes[size], className);
}

/** Inline link — §9.2. Underlined inside prose, plain in navigation. */
export function linkClass(className?: string): string {
  return cx(
    "text-accent rounded-sm transition-colors duration-instant ease-out hover:text-accent-strong",
    className,
  );
}

export function proseLinkClass(className?: string): string {
  return cx(linkClass(className), "underline underline-offset-2");
}
