import { splitReleaseBody } from './github-releases';

export const RELEASE_SUMMARY_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
export const RELEASE_SUMMARY_KEY_PREFIX = 'release-summary:v2:';

const BANNED_NAME = /\b(palette|oracle|scribe|sentinel|vantage|bolt|jules)\b/gi;
const SHA_ONE = /\b[a-f0-9]{7,40}\b/i;
const SHA_ALL = /\b[a-f0-9]{7,40}\b/gi;
const CONVENTIONAL = /\b(?:feat|fix|chore|docs|refactor|test|style|perf|build|ci):\s*/i;

export function releaseSummaryKey(tag: string): string {
  return `${RELEASE_SUMMARY_KEY_PREFIX}${tag}`;
}

export function releaseSummaryPrompt(tag: string, notes: string): string {
  return `Write exactly three plain-English sentences for a hiring manager about this GitHub release.
Say what a visitor can now see or do. Use only facts in the notes.
Do not invent metrics, visitor counts, titles, or outcomes.
The IFS Design System 2x faster delivery / 30x ROI line is allowed if the notes mention it.
Do not name agents, Palettes, Oracles, Scribes, Sentinels, Vantage, Bolt, or Jules.
Do not include git SHAs, issue numbers, or feat/fix prefixes.
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

export function stripExecBanned(text: string): string {
  return text
    .replace(BANNED_NAME, '')
    .replace(SHA_ALL, '')
    .replace(/\(#\d+\)/g, '')
    .replace(/\bissue number\s+\d+\b/gi, '')
    .replace(/\b(?:feat|fix|chore|docs|refactor|test|style|perf|build|ci):\s*/gi, '')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/^[\s:;\-]+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function isSafeReleaseSummary(summary: string, source: string): boolean {
  const text = summary.trim();
  if (!text) return false;
  const count = sentenceCount(text);
  if (count < 2 || count > 4) return false;
  if (
    SHA_ONE.test(text) ||
    /\bissue number\b/i.test(text) ||
    /\bcommit hash\b/i.test(text) ||
    CONVENTIONAL.test(text)
  ) {
    return false;
  }
  const sourceLower = source.toLowerCase();
  for (const token of metricTokens(text)) {
    if (!sourceLower.includes(token)) return false;
  }
  return true;
}

export function prepareReleaseSummary(summary: string, source: string): string | null {
  const original = summary.trim();
  if (
    SHA_ONE.test(original) ||
    /\bissue number\b/i.test(original) ||
    /\bcommit hash\b/i.test(original) ||
    CONVENTIONAL.test(original)
  ) {
    return null;
  }
  const text = stripExecBanned(original);
  return isSafeReleaseSummary(text, source) ? text : null;
}

export function parseModelText(result: unknown): string {
  if (typeof result === 'string') return result.trim();
  if (!result || typeof result !== 'object') return '';
  const row = result as { response?: unknown };
  return typeof row.response === 'string' ? row.response.trim() : '';
}

export function groundedReleaseSummary(tag: string, body: string, title = tag): string {
  const items = splitReleaseBody(body)
    .map((item) => stripExecBanned(item.message.trim()))
    .filter((message) => message.length > 0);
  const listed = (items.length > 0 ? items : body.trim() ? [stripExecBanned(body.trim())] : [])
    .filter((message) => message.length > 0)
    .slice(0, 3);
  const source = `${tag}\n${title}\n${body}`;
  if (listed.length > 0) {
    const text = `The latest release is ${title}. Visitors can now ${listed.join('; ')}. More is in the changelog on this page.`;
    if (isSafeReleaseSummary(text, source)) return text;
  }
  return `The latest release is ${title}. See the changelog below for what shipped. Details stay on this page.`;
}
