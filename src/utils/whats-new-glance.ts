/**
 * Visitor exec summary for /whats-new/: 7-day strip + last-30-day theme groups.
 * Themes come from visitor titles already in the notes. Do not invent ships.
 */

import type { SiteRelease } from './github-releases';
import { splitReleaseBody } from './github-releases';
import { isVisitorFacingBullet } from './release-summary';
import { toVisitorChangelogTitle, toVisitorRelease } from './visitor-changelog';

export const COMMITS_HISTORY_URL =
  'https://github.com/alehar9320/astro-cloudflare-personal-website/commits';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const DROP_PATTERN =
  /\bjson-ld\b|\bgithub[_-]?token\b|\btwin[- ]context\b|\bauthor linkedin context\b|\bno documented changes\b|latest banner from the first card|github links by release version|\bengine\b|\bbolt\b|\bjules\b|\bgoogle-labs-jules\b|\bagent[- ]farm\b|\bprune\b|\bparser\b/i;

const SHA_OR_VERSION_ONLY = /^(?:[a-f0-9]{7,40}|\d{4}\.\d{2}\.\d{2}\.\d{4})$/i;

const VISIBLE_SURFACE =
  /what[’']s new|\bchat\b|\bcomposer\b|\btwin\b|\boverlay\b|\bmenu\b|\blayout\b|\bdock\b|\bbottom sheet\b|\bbubble|\bwork\b|\bbiograph|\banalytics\b|\boutcome\b|\blinkedin\b|\bhire\b|\bget in touch\b|\bglance\b|\bvisitor|\bhome\b|\bcontact\b|\bportrait\b|\bheadshot\b|\brss\b/i;

export type GlanceItem = {
  publishedMs: number;
  title: string;
};

export type GlanceGroup = {
  heading: string;
  lines: string[];
};

export type WhatsNewGlance = {
  groups: GlanceGroup[];
  thisWeek: string[];
};

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
  if (SHA_OR_VERSION_ONLY.test(title) || SHA_OR_VERSION_ONLY.test(raw.trim())) return false;
  if (DROP_PATTERN.test(raw) || DROP_PATTERN.test(title)) return false;
  if (isVisitorFacingBullet(title) || isVisitorFacingBullet(raw.trim())) return true;
  return VISIBLE_SURFACE.test(title) || VISIBLE_SURFACE.test(raw);
}

function themeFor(title: string): Theme | null {
  for (const theme of THEMES) {
    if (theme.test.test(title)) return theme;
  }
  return null;
}

function collectItems(releases: SiteRelease[], nowMs: number): GlanceItem[] {
  const items: GlanceItem[] = [];
  const seen = new Set<string>();

  for (const release of releases.map(toVisitorRelease)) {
    const publishedMs = release.publishedAt ? Date.parse(release.publishedAt) : Number.NaN;
    if (Number.isNaN(publishedMs)) continue;
    const age = nowMs - publishedMs;
    if (age < 0 || age > MONTH_MS) continue;

    const bullets = splitReleaseBody(release.body);
    const lines =
      bullets.length > 0
        ? bullets.map((item) => ({
            raw: item.message,
            title: toVisitorChangelogTitle(item.message),
          }))
        : release.body.trim()
          ? [{ raw: release.body, title: toVisitorChangelogTitle(release.body) }]
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

export function buildWhatsNewGlance(
  releases: SiteRelease[],
  now: Date = new Date()
): WhatsNewGlance {
  const nowMs = now.getTime();
  const items = collectItems(releases, nowMs);
  const thisWeek = items
    .filter((item) => nowMs - item.publishedMs <= WEEK_MS)
    .map((item) => item.title)
    .slice(0, 3);
  const thisWeekKeys = new Set(thisWeek.map((title) => title.toLowerCase()));

  const buckets = new Map<string, GlanceItem[]>();
  for (const item of items) {
    if (thisWeekKeys.has(item.title.toLowerCase())) continue;
    const theme = themeFor(item.title);
    if (!theme) continue;
    const list = buckets.get(theme.heading) ?? [];
    if (list.length < 2) list.push(item);
    buckets.set(theme.heading, list);
  }

  const ranked = THEMES.flatMap((theme) => {
    const list = buckets.get(theme.heading);
    if (!list || list.length === 0) return [];
    return [
      {
        heading: theme.heading,
        lines: list.map((item) => item.title),
        latest: list[0].publishedMs,
      },
    ];
  })
    .sort((a, b) => b.latest - a.latest)
    .slice(0, 4);

  const groups: GlanceGroup[] = ranked.map(({ heading, lines }) => ({ heading, lines }));

  return { thisWeek, groups };
}
