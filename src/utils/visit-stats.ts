export type VisitGlance = {
  pageviews: number;
  uniqueVisitors: number;
  firstSeen: string;
  pageviews7d: number;
  uniqueVisitors7d: number;
  uniqueVisitorsDoD: number | null;
  uniqueVisitorsWoW: number | null;
  uniqueVisitorsMoM: number | null;
  uniqueVisitorsYoY: number | null;
};

export const POSTHOG_SOURCE_LABEL = 'Unique visitors from PostHog (EU)';
export const POSTHOG_SOURCE_TITLE = 'Source: PostHog, eu.posthog.com';

/**
 * Checks whether a given raw value represents a valid positive numeric visit count.
 * @param {unknown} count - The raw count value to validate.
 * @returns {boolean} True if count is a finite number greater than zero.
 */
export function shouldShowVisitCount(count: unknown): count is number {
  return typeof count === 'number' && Number.isFinite(count) && count > 0;
}

/**
 * Formats a pageview count into a human-readable string.
 * @param {number} count - Number of pageviews.
 * @returns {string} Pluralized pageview string (e.g. "1 pageview" or "5 pageviews").
 */
export function formatPageviewCount(count: number): string {
  return `${count} pageview${count === 1 ? '' : 's'}`;
}

/**
 * Formats a unique visitor count into a human-readable string with "up to" prefix.
 * @param {number} count - Number of unique visitors.
 * @returns {string} Formatted unique visitor string (e.g. "up to 1 unique visitor").
 */
export function formatUniqueVisitorCount(count: number): string {
  return `up to ${count} unique visitor${count === 1 ? '' : 's'}`;
}

function asFiniteNumber(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asIsoTimestamp(raw: unknown): string | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString();
  }
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function valueFromRow(
  row: unknown,
  columns: string[] | undefined,
  key: string,
  index: number
): unknown {
  if (row && typeof row === 'object' && !Array.isArray(row) && key in row) {
    return (row as Record<string, unknown>)[key];
  }
  if (Array.isArray(row) && columns) {
    const colIndex = columns.indexOf(key);
    if (colIndex >= 0) return row[colIndex];
  }
  if (Array.isArray(row)) return row[index];
  return undefined;
}

function percentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null) return null;
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous <= 0) return null;
  const pct = ((current - previous) / previous) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * Parses raw PostHog API response payload into a structured VisitGlance object.
 * @param {unknown} payload - Raw API JSON response.
 * @returns {VisitGlance | null} Parsed VisitGlance metrics or null if invalid or incomplete.
 */
export function parseVisitGlance(payload: unknown): VisitGlance | null {
  if (!payload || typeof payload !== 'object') return null;
  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;

  const columns = (payload as { columns?: unknown }).columns;
  const columnNames = Array.isArray(columns)
    ? columns.filter((c): c is string => typeof c === 'string')
    : undefined;

  const row = results[0];
  const pageviews = asFiniteNumber(valueFromRow(row, columnNames, 'pageviews', 0));
  const uniqueVisitors = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors', 1));
  const firstSeen = asIsoTimestamp(valueFromRow(row, columnNames, 'first_seen', 2));
  const pageviews7d = asFiniteNumber(valueFromRow(row, columnNames, 'pageviews_7d', 3));
  const uniqueVisitors7d = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_7d', 4));
  const unique1d = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_1d', 5));
  const unique1dPrev = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_1d_prev', 6));
  const unique7dPrev = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_7d_prev', 7));
  const unique30d = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_30d', 8));
  const unique30dPrev = asFiniteNumber(
    valueFromRow(row, columnNames, 'unique_visitors_30d_prev', 9)
  );
  const unique365d = asFiniteNumber(valueFromRow(row, columnNames, 'unique_visitors_365d', 10));
  const unique365dPrev = asFiniteNumber(
    valueFromRow(row, columnNames, 'unique_visitors_365d_prev', 11)
  );

  if (
    pageviews === null ||
    uniqueVisitors === null ||
    !firstSeen ||
    pageviews7d === null ||
    uniqueVisitors7d === null
  ) {
    return null;
  }

  return {
    pageviews,
    uniqueVisitors,
    firstSeen,
    pageviews7d,
    uniqueVisitors7d,
    uniqueVisitorsDoD: percentChange(unique1d, unique1dPrev),
    uniqueVisitorsWoW: percentChange(uniqueVisitors7d, unique7dPrev),
    uniqueVisitorsMoM: percentChange(unique30d, unique30dPrev),
    uniqueVisitorsYoY: percentChange(unique365d, unique365dPrev),
  };
}

/**
 * Formats an ISO-8601 timestamp string into a localized Stockholm date representation.
 * @param {string} iso - ISO-8601 timestamp string.
 * @returns {string} Formatted date string (e.g. "12 May 2026") or empty string if invalid.
 */
export function formatFirstSeen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a VisitGlance metrics object into user-facing summary strings.
 * @param {VisitGlance} glance - Visit metrics object.
 * @returns {{ all: string; last7d: string; firstSeen: string }} Summary labels for total, 7-day, and first-seen statistics.
 */
export function formatVisitGlance(glance: VisitGlance): {
  all: string;
  last7d: string;
  firstSeen: string;
} {
  const visitors = (count: number) => `${count} visitor${count === 1 ? '' : 's'}`;
  const seen = formatFirstSeen(glance.firstSeen) || glance.firstSeen;
  const last7d =
    glance.pageviews7d === 0 && glance.uniqueVisitors7d === 0
      ? 'No visits in the last 7 days'
      : `${formatPageviewCount(glance.pageviews7d)} · ${visitors(glance.uniqueVisitors7d)} in the last 7 days`;
  return {
    all: `${formatPageviewCount(glance.pageviews)} · ${visitors(glance.uniqueVisitors)}`,
    last7d,
    firstSeen: `First seen ${seen}`,
  };
}

/**
 * Formats a numerical percentage into a rounded, signed percentage string.
 * @param {number} percent - Raw percentage value.
 * @returns {string} Formatted percentage string (e.g. "+12%", "-5%", or "0%").
 */
export function formatSignedPercent(percent: number): string {
  const rounded = Math.round(percent);
  if (rounded === 0) return '0%';
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}%`;
}

export const PERIOD_WORDS = {
  DoD: 'day over day',
  WoW: 'week over week',
  MoM: 'month over month',
  YoY: 'year over year',
} as const;

/**
 * Formats VisitGlance metrics into a compact colophon summary string with period-over-period changes.
 * @param {VisitGlance} glance - Visit metrics object.
 * @returns {string} Dot-separated colophon summary string.
 */
export function formatColophonVisits(glance: VisitGlance): string {
  const parts = [formatUniqueVisitorCount(glance.uniqueVisitors)];
  const periods: Array<[keyof typeof PERIOD_WORDS, number | null]> = [
    ['DoD', glance.uniqueVisitorsDoD],
    ['WoW', glance.uniqueVisitorsWoW],
    ['MoM', glance.uniqueVisitorsMoM],
    ['YoY', glance.uniqueVisitorsYoY],
  ];
  for (const [label, value] of periods) {
    if (value === null || !Number.isFinite(value)) continue;
    parts.push(`${label} ${formatSignedPercent(value)}`);
  }
  return parts.join(' · ');
}

/**
 * Formats VisitGlance metrics into a detailed title string for colophon visit tooltips or metadata.
 * @param {VisitGlance} glance - Visit metrics object.
 * @returns {string} Period-separated colophon title string including PostHog source attribution.
 */
export function formatColophonVisitsTitle(glance: VisitGlance): string {
  const parts = [formatUniqueVisitorCount(glance.uniqueVisitors)];
  const periods: Array<[keyof typeof PERIOD_WORDS, number | null]> = [
    ['DoD', glance.uniqueVisitorsDoD],
    ['WoW', glance.uniqueVisitorsWoW],
    ['MoM', glance.uniqueVisitorsMoM],
    ['YoY', glance.uniqueVisitorsYoY],
  ];
  for (const [label, value] of periods) {
    if (value === null || !Number.isFinite(value)) continue;
    parts.push(`${label} ${PERIOD_WORDS[label]} ${formatSignedPercent(value)}`);
  }
  parts.push(POSTHOG_SOURCE_TITLE);
  return parts.join('. ');
}
