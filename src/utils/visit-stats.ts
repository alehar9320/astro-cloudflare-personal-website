export type VisitGlance = {
  pageviews: number;
  uniqueVisitors: number;
  firstSeen: string;
  pageviews7d: number;
  uniqueVisitors7d: number;
};

export function shouldShowVisitCount(count: unknown): count is number {
  return typeof count === 'number' && Number.isFinite(count) && count > 0;
}

export function formatPageviewCount(count: number): string {
  return `${count} pageview${count === 1 ? '' : 's'}`;
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
  if (Array.isArray(row)) return row[index];
  if (row && typeof row === 'object' && key in row) {
    return (row as Record<string, unknown>)[key];
  }
  if (Array.isArray(row) && columns) {
    const colIndex = columns.indexOf(key);
    if (colIndex >= 0) return row[colIndex];
  }
  return undefined;
}

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

  if (
    pageviews === null ||
    uniqueVisitors === null ||
    !firstSeen ||
    pageviews7d === null ||
    uniqueVisitors7d === null
  ) {
    return null;
  }

  return { pageviews, uniqueVisitors, firstSeen, pageviews7d, uniqueVisitors7d };
}

function formatFirstSeen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

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
