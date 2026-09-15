/* Inline SVG set — design system §10.1: 1.5px stroke, 24px grid, currentColor,
   no fills except status dots, no icon package (NFR-001.4).

   Decorative icons are `aria-hidden`; a meaningful icon always sits next to its
   text (BTN-003, FR-005.5). */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18.5c-4.5 1.3-4.5-2.3-6-2.8m12 5.3v-3.6a3.1 3.1 0 0 0-.9-2.4c3-.3 5.4-1.4 5.4-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.3s-1.4-.4-4.6 1.7a11.6 11.6 0 0 0-6 0C4.3 2.1 2.9 2.5 2.9 2.5a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 1.5 9c0 4.6 2.4 5.7 5.4 6a3.1 3.1 0 0 0-.9 2.4v3.6" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H5.5A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
    </Icon>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4l8.7 15H3.3ZM12 10v4m0 3h.01" />
    </Icon>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}
