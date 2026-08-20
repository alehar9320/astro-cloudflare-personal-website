/**
 * 7-day / 30-day What’s New windows and visitor-outcome grouping.
 * Titles come from release notes via toVisitorChangelogTitle — do not invent facts.
 */

import { splitReleaseBody, type SiteRelease } from './github-releases';
import { toVisitorChangelogTitle } from './visitor-changelog';

export const WEEK_DAYS = 7;
export const WINDOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;
const THIN_NOTE = /^(no documented changes\.?)$/i;

const THEME_ORDER = ['What’s New', 'Chat and layout', 'Work-case copy'] as const;

export type OutcomeGroup = {
  label: string | null;
  titles: string[];
};

export type WhatsNewPageModel = {
  thisWeek: SiteRelease[];
  last30: SiteRelease[];
  latest: SiteRelease | null;
  groups: OutcomeGroup[];
  latestLead: string | null;
};

/**
 * True when publishedAt is on or after now minus `days`.
 */
export function isPublishedSince(publishedAt: string | null, now: Date, days: number): boolean {
  if (!publishedAt) return false;
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return false;
  return published.getTime() >= now.getTime() - days * DAY_MS;
}

export function filterReleasesSince(
  releases: SiteRelease[],
  now: Date,
  days: number
): SiteRelease[] {
  return releases.filter((release) => isPublishedSince(release.publishedAt, now, days));
}

/**
 * Visitor titles for one release. Thin notes (no public bullets) → title / version only.
 */
export function visitorTitlesForRelease(release: SiteRelease): string[] {
  const items = splitReleaseBody(release.body);
  const titles = items
    .map((item) => toVisitorChangelogTitle(item.message).trim())
    .filter((title) => title.length > 0 && !THIN_NOTE.test(title));

  if (titles.length === 0) {
    const fallback = (release.title || release.version).trim();
    return [fallback || release.version];
  }

  return titles;
}

function themeFor(title: string): (typeof THEME_ORDER)[number] | null {
  const t = title.toLowerCase();
  if (/what[’']s new|\bchangelog\b/.test(t)) return 'What’s New';
  if (
    /\b(chat|twin|composer|bubbles?)\b/.test(t) ||
    /\bbottom sheet\b/.test(t) ||
    /\bdock(?:ed)? (?:the )?twin\b/.test(t) ||
    /\bdock chat\b/.test(t)
  ) {
    return 'Chat and layout';
  }
  if (
    /\bjson-ld\b/.test(t) ||
    /\bwork index\b/.test(t) ||
    /\bwork-case\b/.test(t) ||
    /\bbiography\b/.test(t) ||
    /\banalytics\b/.test(t) ||
    /\bcopilots?\b/.test(t) ||
    /\bdesign system\b/.test(t) ||
    /\bthesis\b/.test(t) ||
    /lidk[oö]ping/.test(t) ||
    /problem-approach-outcome/.test(t) ||
    /\bon the \w[\w\s-]* case\b/.test(t)
  ) {
    return 'Work-case copy';
  }
  return null;
}

export function uniqueTitles(titles: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const title of titles) {
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(title);
  }
  return result;
}

/**
 * Group visitor titles by theme when notes already cluster. Singletons stay ungrouped
 * so we do not invent categories.
 */
export function groupVisitorOutcomes(titles: string[]): OutcomeGroup[] {
  const unique = uniqueTitles(titles);
  const tagged = unique.map((title) => ({ title, theme: themeFor(title) }));
  const counts = new Map<string, number>();
  for (const row of tagged) {
    if (row.theme) counts.set(row.theme, (counts.get(row.theme) ?? 0) + 1);
  }

  const buckets = new Map<string, string[]>();
  const leftover: string[] = [];
  for (const { title, theme } of tagged) {
    if (theme && (counts.get(theme) ?? 0) >= 2) {
      const list = buckets.get(theme) ?? [];
      list.push(title);
      buckets.set(theme, list);
    } else {
      leftover.push(title);
    }
  }

  const grouped: OutcomeGroup[] = [];
  for (const label of THEME_ORDER) {
    const groupTitles = buckets.get(label);
    if (groupTitles && groupTitles.length > 0) {
      grouped.push({ label, titles: groupTitles });
    }
  }

  if (grouped.length === 0) {
    return leftover.length > 0 ? [{ label: null, titles: leftover }] : [];
  }
  if (leftover.length > 0) grouped.push({ label: null, titles: leftover });
  return grouped;
}

function leadTitle(release: SiteRelease): string | null {
  const titles = visitorTitlesForRelease(release);
  const first = titles[0];
  if (!first) return null;
  if (first === release.version || first === release.title) return null;
  return first.replace(/\.$/, '');
}

/**
 * Build the What’s New page model. If GitHub is empty the caller passes the snapshot
 * as the only release; if that snapshot is older than 30 days it still appears as
 * the only known latest (do not invent a newer one).
 */
export function buildWhatsNewPage(releases: SiteRelease[], now: Date): WhatsNewPageModel {
  const thisWeek = filterReleasesSince(releases, now, WEEK_DAYS);
  let last30 = filterReleasesSince(releases, now, WINDOW_DAYS);

  if (last30.length === 0 && releases.length > 0) {
    last30 = [releases[0]];
  }

  const latest = last30[0] ?? null;
  const groups = groupVisitorOutcomes(last30.flatMap(visitorTitlesForRelease));

  return {
    thisWeek,
    last30,
    latest,
    groups,
    latestLead: latest ? leadTitle(latest) : null,
  };
}

export function githubReleaseLinkLabel(version: string): string {
  return `View ${version} on GitHub`;
}