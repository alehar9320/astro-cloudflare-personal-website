/**
 * Visitor exec summary for /whats-new/: 7-day strip + last-30-day theme groups.
 * Themes come from visitor titles already in the notes. Do not invent ships.
 */

import type { SiteRelease } from './github-releases';
import { splitReleaseBody } from './github-releases';
import { isVisitorFacingBullet } from './release-summary';
import {
  INTERNAL_CHANGELOG_ITEM,
  isDevShapedUnmappedLine,
  mappedVisitorTitle,
  toVisitorRelease,
} from './visitor-changelog';

export const COMMITS_HISTORY_URL =
  'https://github.com/alehar9320/astro-cloudflare-personal-website/commits';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const DROP_PATTERN =
  /\bjson-ld\b|\bgithub[_-]?token\b|\btwin[- ]context\b|\bauthor linkedin context\b|\bno documented changes\b|latest banner from the first card|github links by release version|\bengine\b|\bbolt\b|\bjules\b|\bgoogle-labs-jules\b|\bagent[- ]farm\b|\bprune\b|\bparser\b|\bpalette\b|\boracle\b|\bscribe\b|\bsentinel\b|\bvantage\b|\bkinetic\b|\bprism\b|\bapex\b|\baurora\b|\bjanitor\b|\bobservabilityclerk\b|\bstuntdouble\b|\bstunt[- ]double\b|\barchie\b|[🎨🔮✍️🛡️🔍⚡🐱⚙️👩‍🚀👨‍💼❤️🧹📋🎭🏛️🧑‍🎓]|\bunit[- ]test\b|\bcoverage\b|\bvisitor[- ]changelog\b|\btest[- ]only\b|\bvitest\b|\bplaywright\b/i;

const SHA_OR_VERSION_ONLY = /^(?:[a-f0-9]{7,40}|\d{4}\.\d{2}\.\d{2}\.\d{4})$/i;

/* Case, copilots, thesis, design-system and theme-toggle lines are visible on the site too.
   Without them, newer case/biography ships lost This week to older chat lines (Vera, #1579).
   "case" means a case-study page, so dev compounds (edge/test/use/corner case, lower/camel case,
   switch case) don't qualify a line on their own. */
const VISIBLE_SURFACE =
  /(?<!\b(?:edge|test|use|corner|base|lower|upper|camel|snake|kebab|title|switch)[- ])\bcase\b|\bcopilot|\bthesis\b|\bdesign system\b|\btheme[- ]toggle\b|what[’']s new|\bchat\b|\bcomposer\b|\btwin\b|\boverlay\b|\bmenu\b|\blayout\b|\bdock\b|\bbottom sheet\b|\bbubble|\bwork\b|\bbiograph|\banalytics\b|\boutcome\b|\blinkedin\b|\bhire\b|\bget in touch\b|\bglance\b|\bvisitor|\bhome\b|\bcontact\b|\bportrait\b|\bheadshot\b|\brss\b/i;

export type GlanceItem = {
  publishedMs: number;
  title: string;
};

export type GlanceGroup = {
  heading: string;
  lines: string[];
};

/** One release's visitor lines, shown as "Latest updates" when the 30-day window is empty (#1579). */
export type LatestUpdates = {
  /** YYYY-MM-DD in Europe/Stockholm, for `<time datetime>`. */
  datetime: string;
  /** e.g. "Last updated 1 Sep 2026", Europe/Stockholm. */
  label: string;
  lines: string[];
};

export type WhatsNewGlance = {
  groups: GlanceGroup[];
  /** Set only when thisWeek and groups are both empty and some release has a kept line. */
  latest?: LatestUpdates;
  thisWeek: string[];
};

const LATEST_MAX_LINES = 3;
const SITE_TIME_ZONE = 'Europe/Stockholm';

/* Optimization (⚙️ Engine): Hoist Intl.DateTimeFormat instances to module scope.
   Benchmark: Eliminates repeated Intl.DateTimeFormat object instantiation and locale options parsing per call on edge SSR. */
const DATETIME_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
});

const HUMAN_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
});

type Theme = {
  heading: string;
  test: RegExp;
};

const THEMES: Theme[] = [
  { heading: "What's New", test: /what[’']s new|\bchangelog\b|\brelease notes\b/i },
  {
    heading: 'Chat and layout',
    test: /\bchat\b|\bcomposer\b|\btwin\b|\boverlay\b|\bmenu\b|\blayout\b|\bdock\b|\bbottom sheet\b|\bbubble|\bglance\b/i,
  },
  {
    heading: 'Work-case copy',
    test: /\bwork\b|\banalytic|\boutcome\b|\bbiograph|\bdesign system\b|\bcopilot|\bthesis\b|\blidk[oö]ping/i,
  },
  {
    heading: 'Hire and LinkedIn',
    test: /\blinkedin\b|\bhire\b|\bget in touch\b|\bcontact\b/i,
  },
];

export function isKeptVisitorLine(raw: string, visitorTitle: string): boolean {
  const title = visitorTitle.trim();
  if (!title) return false;
  // Mapped VISITOR_CHANGELOG rows always render (Matt's call (b), #1163).
  if (mappedVisitorTitle(raw) || mappedVisitorTitle(title)) return true;
  // Unmapped and still shaped like an engineering squash: hidden.
  if (isDevShapedUnmappedLine(raw) || isDevShapedUnmappedLine(title)) return false;
  if (SHA_OR_VERSION_ONLY.test(title) || SHA_OR_VERSION_ONLY.test(raw.trim())) return false;
  if (
    DROP_PATTERN.test(raw) ||
    DROP_PATTERN.test(title) ||
    INTERNAL_CHANGELOG_ITEM.test(raw) ||
    INTERNAL_CHANGELOG_ITEM.test(title)
  ) {
    return false;
  }
  if (isVisitorFacingBullet(title) || isVisitorFacingBullet(raw.trim())) return true;
  return VISIBLE_SURFACE.test(title) || VISIBLE_SURFACE.test(raw);
}

function themeFor(title: string): Theme | null {
  for (const theme of THEMES) {
    if (theme.test.test(title)) return theme;
  }
  return null;
}

/**
 * Collects and filters visitor-facing release items within the last 30 days.
 * Optimization (⚡ Bolt): Iterates over raw releases directly and avoids re-running
 * `toVisitorChangelogTitle` on bullet messages that were already transformed by `toVisitorRelease`.
 * Benchmark: Eliminates intermediate `releases.map()` array allocation and redundant regex transforms per release bullet.
 */
function collectItems(releases: SiteRelease[], nowMs: number): GlanceItem[] {
  const items: GlanceItem[] = [];
  const seen = new Set<string>();

  for (const rawRelease of releases) {
    const release = toVisitorRelease(rawRelease);
    const publishedMs = release.publishedAt ? Date.parse(release.publishedAt) : Number.NaN;
    if (Number.isNaN(publishedMs)) continue;
    const age = nowMs - publishedMs;
    if (age < 0 || age > MONTH_MS) continue;

    const bullets = splitReleaseBody(release.body);
    const lines =
      bullets.length > 0
        ? bullets.map((item) => ({
            raw: item.message,
            title: item.message,
          }))
        : release.body.trim()
          ? [{ raw: release.body, title: release.body }]
          : [];

    for (const line of lines) {
      if (!isKeptVisitorLine(line.raw, line.title)) continue;
      const key = line.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ publishedMs, title: line.title });
    }
  }

  items.sort((a, b) => b.publishedMs - a.publishedMs);
  return items;
}

function keptLinesOf(rawRelease: SiteRelease): string[] {
  const release = toVisitorRelease(rawRelease);
  const bullets = splitReleaseBody(release.body);
  const lines =
    bullets.length > 0
      ? bullets.map((item) => item.message)
      : release.body.trim()
        ? [release.body]
        : [];
  const kept: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    if (!isKeptVisitorLine(line, line)) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(line);
    if (kept.length >= LATEST_MAX_LINES) break;
  }
  return kept;
}

export function formatLatestUpdatesDate(publishedMs: number): { datetime: string; label: string } {
  const date = new Date(publishedMs);
  const datetime = DATETIME_FORMATTER.format(date);
  const human = HUMAN_DATE_FORMATTER.format(date);
  return { datetime, label: `Last updated ${human}` };
}

/**
 * "Latest updates" fallback (#1579): one date = one release. Walk releases newest first
 * (any age) and take up to 3 kept visitor lines from the first release that yields one.
 * Same toVisitorRelease / isKeptVisitorLine path as This week, so call (b) still holds.
 */
export function selectLatestUpdates(releases: SiteRelease[]): LatestUpdates | undefined {
  const dated = releases
    .map((release) => ({
      publishedMs: release.publishedAt ? Date.parse(release.publishedAt) : Number.NaN,
      release,
    }))
    .filter((entry) => !Number.isNaN(entry.publishedMs))
    .sort((a, b) => b.publishedMs - a.publishedMs);
  for (const { publishedMs, release } of dated) {
    const lines = keptLinesOf(release);
    if (lines.length > 0) return { ...formatLatestUpdatesDate(publishedMs), lines };
  }
  return undefined;
}

/** True when the page has any visitor lines to show (This week, Last 30 days or Latest updates). */
export function hasGlanceContent(glance: WhatsNewGlance): boolean {
  return glance.thisWeek.length > 0 || glance.groups.length > 0 || Boolean(glance.latest);
}

/**
 * Builds executive glance summary for /whats-new/: top 3 items for this week + theme groups for last 30 days.
 * Optimization (⚡ Bolt): Single-pass extraction of top 3 weekly items and theme groups avoids intermediate array
 * allocations (.filter().map().slice() and .flatMap()), reducing edge Worker memory churn on SSR.
 * Benchmark: Eliminates 5 intermediate array allocations per call on edge runtimes.
 */
export function buildWhatsNewGlance(
  releases: SiteRelease[],
  now: Date = new Date()
): WhatsNewGlance {
  const nowMs = now.getTime();
  const items = collectItems(releases, nowMs);

  const thisWeek: string[] = [];
  const thisWeekKeys = new Set<string>();

  for (const item of items) {
    if (nowMs - item.publishedMs <= WEEK_MS) {
      if (thisWeek.length < 3) {
        thisWeek.push(item.title);
        thisWeekKeys.add(item.title.toLowerCase());
      }
    }
  }

  const buckets = new Map<string, GlanceItem[]>();
  for (const item of items) {
    if (thisWeekKeys.has(item.title.toLowerCase())) continue;
    const theme = themeFor(item.title);
    if (!theme) continue;
    const list = buckets.get(theme.heading) ?? [];
    if (list.length < 2) list.push(item);
    buckets.set(theme.heading, list);
  }

  const ranked: { heading: string; lines: string[]; latest: number }[] = [];
  for (const theme of THEMES) {
    const list = buckets.get(theme.heading);
    if (list && list.length > 0) {
      ranked.push({
        heading: theme.heading,
        lines: list.map((item) => item.title),
        latest: list[0].publishedMs,
      });
    }
  }

  ranked.sort((a, b) => b.latest - a.latest);
  if (ranked.length > 4) ranked.length = 4;

  const groups: GlanceGroup[] = ranked.map(({ heading, lines }) => ({ heading, lines }));

  if (thisWeek.length === 0 && groups.length === 0) {
    const latest = selectLatestUpdates(releases);
    if (latest) return { thisWeek, groups, latest };
  }
  return { thisWeek, groups };
}
