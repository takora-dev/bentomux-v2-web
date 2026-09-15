/* Minimal build-time content validation (NFR-006.3). No dependency: a malformed
   content entry throws while the module graph is evaluated, which fails the
   build instead of rendering a blank section. */

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[content] ${message}`);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function requireNonEmpty(value: unknown, label: string): string {
  invariant(isNonEmptyString(value), `${label} must be a non-empty string`);
  return value;
}

/** Shortest content list that still renders a section; also used to keep two
 *  mirrored lists (group heading + group items) from drifting apart. */
export function requireCount(
  values: readonly unknown[],
  expected: number,
  label: string,
): void {
  invariant(
    values.length === expected,
    `${label} must have exactly ${expected} entries, found ${values.length}`,
  );
}

export function requireUnique<T>(values: readonly T[], key: (value: T) => string, label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    const id = key(value);
    invariant(!seen.has(id), `${label} contains a duplicate key "${id}"`);
    seen.add(id);
  }
}
