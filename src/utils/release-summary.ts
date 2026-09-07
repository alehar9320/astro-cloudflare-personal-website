import { splitReleaseBody } from './github-releases';

export const RELEASE_SUMMARY_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
export const RELEASE_SUMMARY_KEY_PREFIX = 'release-summary:v4:';

const BANNED_NAME = /\b(palette|oracle|scribe|sentinel|vantage|bolt|jules)\b/gi;
const SHA_ONE = /\b[a-f0-9]{7,40}\b/i;
const SHA_ALL = /\b[a-f0-9]{7,40}\b/gi;
const CONVENTIONAL = /\b(?:feat|fix|chore|docs|refactor|test|style|perf|build|ci):\s*/i;
const ENGINEERING_LEAK =
  /\bexec summary\b|\bof the latest github release\b|cloudflare:workers|\bnode stub\b|\bsessionstorage\b|\bdo not paint\b|\bexec box\b|\bon \/whats-new\b|\balias\b/i;
const VISITOR_VERB =
  /^(open|tap|see|read|view|show|visit|browse|get|use|download|contact|inline)\b/i;

export function isVisitorFacingBullet(message: string): boolean {
  const text = message.trim();
  if (!text || ENGINEERING_LEAK.test(text)) return false;
  return VISITOR_VERB.test(text);
}

export function releaseSummaryKey(tag: string): string {
  return `${RELEASE_SUMMARY_KEY_PREFIX}${tag}`;
}

export function releaseSummaryPrompt(tag: string, notes: string): string {
  return `Write exactly three plain-English sentences for a hiring manager about this GitHub release.
Say what a visitor can now see or do. Use only facts in the notes.
Do not invent metrics, visitor counts, titles, or outcomes.
The IFS Design System up to 2x faster delivery / up to 30x ROI line is allowed if the notes mention it.
Do not name agents, Palettes, Oracles, Scribes, Sentinels, Vantage, Bolt, or Jules.
Do not include git SHAs, issue numbers, or feat/fix prefixes.
No bullets, headings, or quotation marks around the whole answer.

Release: ${tag}
Notes:
${notes}`;
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+/;
const METRIC_TOKENS_REGEX = /\b\d+(?:\.\d+)?x\b|\b\d+%\b|\broi\b|\bmillion\b|\bbillion\b/gi;
const PAREN_HASH_REGEX = /\(#\d+\)/g;
const PLAIN_HASH_REGEX = /#\d+/g;
const ISSUE_NUMBER_DIGITS_REGEX = /\bissue number\s+\d+\b/gi;
const CONVENTIONAL_PREFIX_GLOBAL =
  /\b(?:feat|fix|chore|docs|refactor|test|style|perf|build|ci):\s*/gi;
const PUNCTUATION_SPACE_REGEX = /\s+([.,;:])/g;
const LEADING_PUNCTUATION_REGEX = /^[\s:;\-]+/;
const MULTI_SPACE_REGEX = /\s{2,}/g;

function sentenceCount(text: string): number {
  const parts = text.split(SENTENCE_SPLIT);
  let count = 0;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].trim().length > 0) {
      count++;
    }
  }
  return count;
}

function metricTokens(text: string): string[] {
  const matches = text.match(METRIC_TOKENS_REGEX);
  if (!matches) return [];
  for (let i = 0; i < matches.length; i++) {
    matches[i] = matches[i].toLowerCase();
  }
  return matches;
}

export function stripExecBanned(text: string): string {
  return text
    .replace(BANNED_NAME, '')
    .replace(SHA_ALL, '')
    .replace(PAREN_HASH_REGEX, '')
    .replace(PLAIN_HASH_REGEX, '')
    .replace(ISSUE_NUMBER_DIGITS_REGEX, '')
    .replace(CONVENTIONAL_PREFIX_GLOBAL, '')
    .replace(PUNCTUATION_SPACE_REGEX, '$1')
    .replace(LEADING_PUNCTUATION_REGEX, '')
    .replace(MULTI_SPACE_REGEX, ' ')
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
    /\B#\d+\b/.test(text) ||
    CONVENTIONAL.test(text) ||
    ENGINEERING_LEAK.test(text)
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
    /\B#\d+\b/.test(original) ||
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
  const rawItems = splitReleaseBody(body);
  const items: string[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    const stripped = stripExecBanned(rawItems[i].message.trim());
    if (isVisitorFacingBullet(stripped)) {
      items.push(stripped);
    }
  }

  const candidateSource =
    items.length > 0 ? items : body.trim() ? [stripExecBanned(body.trim())] : [];
  const listed: string[] = [];
  for (let i = 0; i < candidateSource.length; i++) {
    if (isVisitorFacingBullet(candidateSource[i])) {
      listed.push(candidateSource[i]);
      if (listed.length === 3) break;
    }
  }

  const source = `${tag}\n${title}\n${body}`;
  if (listed.length > 0) {
    const text = `The latest release is ${title}. Visitors can now ${listed.join('; ')}. More is in the changelog on this page.`;
    if (isSafeReleaseSummary(text, source)) return text;
  }
  return `The latest release is ${title}. See the changelog below for what shipped. Details stay on this page.`;
}
