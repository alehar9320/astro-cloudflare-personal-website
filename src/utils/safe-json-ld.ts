/**
 * Safely serializes an object into a JSON string for embedding within HTML <script> tags.
 * Replaces '<' with '\\u003c' to prevent HTML script block breakout / XSS (e.g. </script> injection).
 */
export function safeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
