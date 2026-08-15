export const RELEASE_SUMMARY_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
export const RELEASE_SUMMARY_KEY_PREFIX = 'release-summary:';

const BANNED_NAME = /\b(palette|oracle|scribe|sentinel|vantage|bolt|jules)\b/i;

export function releaseSummaryKey(tag: string): string {
  return `${RELEASE_SUMMARY_KEY_PREFIX}${tag}`;
}

export function releaseSummaryPrompt(tag: string, notes: string): string {
  return `Summarize this GitHub release in 2 to 4 plain-English sentences for an executive.
Use only facts in the notes. Do not invent metrics, ROI, visitor counts, titles, or outcomes.
Do not name agents, Palettes, Oracles, Scribes, Sentinels, Vantage, Bolt, or Jules.
No bullets, headings, or quotation marks around the whole answer.

Release: ${tag}
Notes:
${notes}`;
}

function sentenceCount(text: string): number {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

function metricTokens(text: string): string[] {
  const matches = text.match(/\b\d+(?:\.\d+)?x\b|\b\d+%\b|\broi\b|\bmillion\b|\bbillion\b/gi);
  return matches ? matches.map((token) => token.toLowerCase()) : [];
}

export function isSafeReleaseSummary(summary: string, source: string): boolean {
  const text = summary.trim();
  if (!text) return false;
  const count = sentenceCount(text);
  if (count < 2 || count > 4) return false;
  if (BANNED_NAME.test(text)) return false;
  const sourceLower = source.toLowerCase();
  for (const token of metricTokens(text)) {
    if (!sourceLower.includes(token)) return false;
  }
  return true;
}

export function parseModelText(result: unknown): string {
  if (!result || typeof result !== 'object') return '';
  const row = result as { response?: unknown };
  return typeof row.response === 'string' ? row.response.trim() : '';
}
