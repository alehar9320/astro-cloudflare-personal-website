/**
 * Safely stringifies an object for inclusion in a <script> tag.
 * Replaces '<' with its unicode escape sequence to prevent XSS breakouts.
 */
export function safeStringify(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
