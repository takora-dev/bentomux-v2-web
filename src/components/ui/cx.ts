/** Joins conditional class names. No dependency: this is the whole helper. */
export function cx(...parts: readonly (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
