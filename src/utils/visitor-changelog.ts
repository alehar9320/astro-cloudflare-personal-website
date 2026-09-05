/**
 * Visitor-facing changelog titles for What’s New.
 * Maps known shipped conventional-commit lines to short sentences.
 * Unknown items keep their meaning after SHA / type / PR chrome is stripped.
 */

export type VisitorChangelogEntry = {
  pr: number;
  subject: string;
  title: string;
};

/** Known shipped PRs on this site. Do not invent work that is not in the feed. */
export const VISITOR_CHANGELOG: readonly VisitorChangelogEntry[] = [
  {
    pr: 524,
    subject: 'rewrite What’s New for visitors',
    title: 'What’s New rewritten for visitors',
  },
  {
    pr: 523,
    subject: 'rewrite /experimental/now/ for visitors',
    title: 'Now page rewritten for visitors',
  },
  {
    pr: 522,
    subject: 'drop experimental pages from the sitemap',
    title: 'Experimental pages removed from the sitemap',
  },
  {
    pr: 521,
    subject: 'drop sitemap URLs that 404',
    title: 'Sitemap no longer lists pages that 404',
  },
  {
    pr: 520,
    subject: 'add a live RSS feed for the work',
    title: 'RSS feed of the work',
  },
  {
    pr: 519,
    subject: 'offer LinkedIn hire on the not-found page',
    title: 'Get in touch on LinkedIn from the not-found page',
  },
  {
    pr: 518,
    subject: 'add a working web app manifest',
    title: 'Web app manifest',
  },
  {
    pr: 517,
    subject: 'add a working apple-touch-icon',
    title: 'Home-screen icon',
  },
  {
    pr: 516,
    subject: 'point robots.txt at the live sitemap',
    title: 'robots.txt points at the sitemap',
  },
  {
    pr: 515,
    subject: 'add a live sitemap for search',
    title: 'Sitemap of the live site',
  },
  {
    pr: 514,
    subject: 'add live rel=canonical for search and shares',
    title: 'Canonical URL for the live site',
  },
  {
    pr: 513,
    subject: 'make the twin the Home first-view',
    title: 'Chat is the first view on Home',
  },
  {
    pr: 511,
    subject: 'put the Home headshot in the twin',
    title: 'Home headshot in the chat',
  },
  {
    pr: 510,
    subject: 'keep the docked chat FAB off footer GitHub at 1280',
    title: 'Chat button no longer covers the footer GitHub link',
  },
  {
    pr: 508,
    subject: 'conversational fold for the twin',
    title: 'Conversational layout for the chat',
  },
  {
    pr: 507,
    subject: 'add PM/DevEx to work-case share description',
    title: 'Work-case shares include Product Manager, Developer Experience',
  },
  {
    pr: 506,
    subject: 'work-case browser titles include PM/DevEx',
    title: 'Work-case browser titles include Product Manager, Developer Experience',
  },
  {
    pr: 505,
    subject: 'work-case share preview includes PM/DevEx and LinkedIn',
    title: 'Work-case share preview includes Product Manager, Developer Experience and LinkedIn',
  },
  {
    pr: 504,
    subject: 'point share URLs at the live site',
    title: 'Share URLs point at the live site',
  },
  {
    pr: 503,
    subject: 'point structured data at the live site',
    title: 'Structured data points at the live site',
  },
  {
    pr: 496,
    subject: 'put IFS Design System first and Lidköping last on /work',
    title: 'IFS Design System first on Work, Lidköping last',
  },
  {
    pr: 502,
    subject: 'show the published design-system outcome on /work',
    title: 'Published design-system outcome on Work',
  },
  {
    pr: 501,
    subject: 'point LinkedIn share photos at the live portrait',
    title: 'LinkedIn share photos use the live portrait',
  },
  {
    pr: 500,
    subject: 'set the twin idle prompt to Ask about the work',
    title: 'Chat prompt is Ask about the work',
  },
  {
    pr: 499,
    subject: 'let visitors clear the twin chat and drop the FAB portrait',
    title: 'Visitors can clear the chat',
  },
  {
    pr: 494,
    subject: "frame the master's thesis as earlier work, not a PM case",
    title: "Master's thesis framed as earlier work",
  },
  {
    pr: 493,
    subject: 'frame Lidköping as earlier work, not a PM case',
    title: 'Lidköping framed as earlier work',
  },
  {
    pr: 492,
    subject: 'rewrite analytics page as a visitor PM story',
    title: 'Analytics page rewritten for visitors',
  },
  {
    pr: 491,
    subject: 'rewrite copilots page as a visitor PM story',
    title: 'Copilots page rewritten for visitors',
  },
  {
    pr: 490,
    subject: 'fold About into Biography as one visitor page',
    title: 'About folded into Biography',
  },
  {
    pr: 489,
    subject: 'rewrite IFS Design System page as a visitor PM story',
    title: 'IFS Design System page rewritten for visitors',
  },
];

const BY_PR = new Map(VISITOR_CHANGELOG.map((entry) => [entry.pr, entry.title]));
const BY_SUBJECT = new Map(
  VISITOR_CHANGELOG.map((entry) => [entry.subject.toLowerCase(), entry.title])
);

const SHA_PREFIX = /^[a-f0-9]{7,40}\s+/i;
const CONVENTIONAL_PREFIX =
  /^(feat|fix|chore|docs|refactor|test|style|perf|build|ci)(\([^)]+\))?:\s*/i;
const PR_SUFFIX = /\s*\(#(\d+)\)\s*$/;
const MULTI_SPACE = /\s{2,}/g;
const LIST_ITEM_PREFIX = /^[-*+]\s+/;

/**
 * Strip SHA, conventional-commit type, and trailing (#123) from a changelog line.
 */
export function stripChangelogChrome(raw: string): string {
  return raw
    .trim()
    .replace(SHA_PREFIX, '')
    .replace(CONVENTIONAL_PREFIX, '')
    .replace(PR_SUFFIX, '')
    .replace(MULTI_SPACE, ' ')
    .trim();
}

function titleCaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const INTERNAL_CHANGELOG_ITEM =
  /\bjules\b|\bagent[- ]farm\b|\bjohan nits\b|\bengine\b|\bbolt\b|\bgoogle-labs-jules\b|\bprune\b|\bparser\b/i;

/**
 * Visitor sentence for a changelog item. Lookup known shipped PRs, else sanitize.
 * Idempotent: already-visitor copy (no SHA / type / PR chrome) is returned as-is.
 */
export function toVisitorChangelogTitle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const prMatch = trimmed.match(/\(#(\d+)\)/);
  if (prMatch) {
    const mapped = BY_PR.get(Number(prMatch[1]));
    if (mapped) return mapped;
  }

  const subject = stripChangelogChrome(trimmed);
  const bySubject = BY_SUBJECT.get(subject.toLowerCase());
  if (bySubject) return bySubject;

  if (subject === trimmed) return trimmed;
  if (!subject) return titleCaseFirst(trimmed.replace(SHA_PREFIX, '').trim());
  return titleCaseFirst(subject);
}

/**
 * Rewrite a GitHub release body so list items are visitor copy, not SHA + feat + (#PR).
 * Single-pass implementation to eliminate intermediate array and string allocations on Edge runtimes.
 */
export function toVisitorReleaseBody(body: string): string {
  const lines = body.split('\n');
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!LIST_ITEM_PREFIX.test(trimmed)) continue;

    const message = trimmed.replace(LIST_ITEM_PREFIX, '');
    if (INTERNAL_CHANGELOG_ITEM.test(message)) continue;

    items.push(`- ${toVisitorChangelogTitle(message)}`);
  }

  if (items.length === 0) {
    const trimmed = body.trim();
    return trimmed ? toVisitorChangelogTitle(trimmed) : '';
  }

  return items.join('\n');
}

/**
 * Keep dates, URLs, and versions. Replace changelog names with visitor sentences.
 */
export function toVisitorRelease<T extends { body: string }>(release: T): T {
  return { ...release, body: toVisitorReleaseBody(release.body) };
}
