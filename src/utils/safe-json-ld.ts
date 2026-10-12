/* Optimization (⚡ Bolt): Hoist static RegExp instance to module scope to avoid re-compiling
   the regex on every safeJsonLd invocation during page builds and SSR rendering.
   Benchmark: Eliminates redundant regex object allocations and compilations per JSON-LD stringification. */
const LESS_THAN_REGEX = /</g;

/**
 * Safely serializes an object into a JSON string for embedding within HTML <script> tags.
 * Replaces '<' with '\\u003c' to prevent HTML script block breakout / XSS (e.g. </script> injection).
 */
export function safeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(LESS_THAN_REGEX, '\\u003c');
}
