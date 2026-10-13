import { env } from 'cloudflare:workers';

/**
 * Live Currents for /okr/ (#1663). Every value is fetched from GitHub search or
 * PostHog at request time and cached for one hour in `caches.default`. A source
 * that is missing or down reads 'No data yet'; nothing here is hand-typed.
 */

export type OkrMetric = {
  id: string;
  value: number | null;
  valueLabel: string;
  source: 'GitHub' | 'PostHog';
  updatedAt: string | null;
};

export type OkrSnapshot = { metrics: Record<string, OkrMetric>; generatedAt: string };

type OkrEnv = {
  GITHUB_TOKEN?: string;
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

export const NO_DATA = 'No data yet';
const CACHE_KEY = 'https://me.alehar.workers.dev/__okr-snapshot-v1';
const CACHE_CONTROL = 'max-age=3600';
const UPSTREAM_TIMEOUT_MS = 3000;
const REPO = 'repo:alehar9320/astro-cloudflare-personal-website';
const USER_AGENT = 'alehar9320-astro-cloudflare-personal-website';
const DEFAULT_PROJECT_ID = '171414';
const DEFAULT_QUERY_HOST = 'https://eu.posthog.com';

export const KR11_HOGQL =
  "SELECT count(DISTINCT person_id) FROM events WHERE event = '$pageview' AND properties.$host = 'me.alehar.workers.dev' AND properties.$os != 'Linux' AND timestamp >= now() - INTERVAL 14 DAY";

export const KR12_WEB_OVERVIEW = {
  kind: 'WebOverviewQuery',
  dateRange: { date_from: '-14d' },
  properties: [
    { key: '$host', value: 'me.alehar.workers.dev', operator: 'exact', type: 'event' },
    { key: '$os', value: 'Linux', operator: 'is_not', type: 'event' },
  ],
  filterTestAccounts: true,
} as const;

export const KR22_HOGQL =
  "SELECT count(DISTINCT person_id) FROM events WHERE timestamp >= now() - INTERVAL 30 DAY AND properties.$host = 'me.alehar.workers.dev' AND properties.$os != 'Linux' AND (event = 'Contact card — Get in touch / LinkedIn hire' OR (event = '$autocapture' AND (elements_chain_href ILIKE '%linkedin.com%' OR arrayExists(t -> t ILIKE '%Get in touch%', elements_chain_texts))))";

/** closedUnmerged ÷ (merged + closedUnmerged) × 100; 0 + 0 → null. */
export function closeRate(merged: number, closedUnmerged: number): number | null {
  const total = merged + closedUnmerged;
  if (!Number.isFinite(total) || total <= 0) return null;
  return (closedUnmerged / total) * 100;
}

/** One decimal + '%'; null → 'No data yet'. */
export function formatPercent(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return NO_DATA;
  return `${n.toFixed(1)}%`;
}

function readEnv(): OkrEnv {
  try {
    if (env && typeof env === 'object') return env as OkrEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

function isoDaysAgo(days: number, now: Date): string {
  return new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function empty(id: string, source: OkrMetric['source']): OkrMetric {
  return { id, value: null, valueLabel: NO_DATA, source, updatedAt: null };
}

async function githubCount(q: string, token: string): Promise<number> {
  const res = await timedFetch(`https://api.github.com/search/issues?q=${q}&per_page=1`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${token}`,
      'User-Agent': USER_AGENT,
    },
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const body = (await res.json()) as { total_count?: unknown };
  if (typeof body.total_count !== 'number') throw new Error('github shape');
  return body.total_count;
}

async function githubMetrics(bindings: OkrEnv, now: Date): Promise<OkrMetric[]> {
  const ids = ['KR3.1', 'KR3.2', 'KR3.3'];
  const token = bindings.GITHUB_TOKEN?.trim();
  if (!token) return ids.map((id) => empty(id, 'GitHub'));
  try {
    const since7 = isoDaysAgo(7, now);
    const since30 = isoDaysAgo(30, now);
    const [merged7, open, closedUnmerged30, merged30] = await Promise.all([
      githubCount(`${REPO}+is:pr+is:merged+base:main+merged:%3E%3D${since7}`, token),
      githubCount(`${REPO}+is:pr+is:open`, token),
      githubCount(`${REPO}+is:pr+is:closed+is:unmerged+closed:%3E%3D${since30}`, token),
      githubCount(`${REPO}+is:pr+is:merged+merged:%3E%3D${since30}`, token),
    ]);
    const updatedAt = new Date().toISOString();
    const rate = closeRate(merged30, closedUnmerged30);
    return [
      { id: 'KR3.1', value: merged7, valueLabel: String(merged7), source: 'GitHub', updatedAt },
      { id: 'KR3.2', value: open, valueLabel: String(open), source: 'GitHub', updatedAt },
      {
        id: 'KR3.3',
        value: rate,
        valueLabel: formatPercent(rate),
        source: 'GitHub',
        updatedAt: rate === null ? null : updatedAt,
      },
    ];
  } catch {
    console.error({ event: 'okr_github_failed' });
    return ids.map((id) => empty(id, 'GitHub'));
  }
}

async function posthogQuery(
  host: string,
  projectId: string,
  key: string,
  query: unknown
): Promise<unknown> {
  const res = await timedFetch(`${host}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`posthog ${res.status}`);
  return res.json();
}

function hogql(query: string) {
  return { kind: 'HogQLQuery', query, filters: { filterTestAccounts: true } };
}

function firstCell(payload: unknown): number {
  const v = (payload as { results?: unknown[][] })?.results?.[0]?.[0];
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error('posthog shape');
  return v;
}

function bounceRate(payload: unknown): number {
  const results = (payload as { results?: { key?: string; value?: unknown }[] })?.results;
  const item = Array.isArray(results) ? results.find((r) => r?.key === 'bounce rate') : undefined;
  if (typeof item?.value !== 'number' || !Number.isFinite(item.value)) throw new Error('shape');
  return item.value;
}

async function posthogMetrics(bindings: OkrEnv): Promise<OkrMetric[]> {
  const ids = ['KR1.1', 'KR1.2', 'KR2.2'];
  const key = bindings.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = (bindings.POSTHOG_PROJECT_ID || DEFAULT_PROJECT_ID).trim();
  let host: string;
  try {
    const parsed = new URL((bindings.POSTHOG_QUERY_HOST || DEFAULT_QUERY_HOST).trim());
    if (parsed.protocol !== 'https:') throw new Error('host');
    host = parsed.origin;
  } catch {
    return ids.map((id) => empty(id, 'PostHog'));
  }
  if (!key || !/^\d+$/.test(projectId)) return ids.map((id) => empty(id, 'PostHog'));
  try {
    const [visitors, overview, hire] = await Promise.all([
      posthogQuery(host, projectId, key, hogql(KR11_HOGQL)),
      posthogQuery(host, projectId, key, KR12_WEB_OVERVIEW),
      posthogQuery(host, projectId, key, hogql(KR22_HOGQL)),
    ]);
    const updatedAt = new Date().toISOString();
    const v = firstCell(visitors);
    const b = bounceRate(overview);
    const h = firstCell(hire);
    return [
      { id: 'KR1.1', value: v, valueLabel: String(v), source: 'PostHog', updatedAt },
      { id: 'KR1.2', value: b, valueLabel: formatPercent(b), source: 'PostHog', updatedAt },
      { id: 'KR2.2', value: h, valueLabel: String(h), source: 'PostHog', updatedAt },
    ];
  } catch {
    console.error({ event: 'okr_posthog_failed' });
    return ids.map((id) => empty(id, 'PostHog'));
  }
}

function getCache(): Cache | null {
  try {
    const c = (globalThis as { caches?: { default?: Cache } }).caches?.default;
    return c ?? null;
  } catch {
    return null;
  }
}

/** Builds (or reads the hourly cached) snapshot. Never throws. */
export async function getOkrSnapshot(): Promise<OkrSnapshot> {
  const cache = getCache();
  try {
    const hit = await cache?.match(CACHE_KEY);
    if (hit) return (await hit.json()) as OkrSnapshot;
  } catch {
    // Cache miss path below.
  }
  let snapshot: OkrSnapshot;
  try {
    const bindings = readEnv();
    const now = new Date();
    const [gh, ph] = await Promise.all([githubMetrics(bindings, now), posthogMetrics(bindings)]);
    const metrics: Record<string, OkrMetric> = {};
    for (const m of [...ph, ...gh]) metrics[m.id] = m;
    snapshot = { metrics, generatedAt: new Date().toISOString() };
  } catch {
    return { metrics: {}, generatedAt: new Date().toISOString() };
  }
  try {
    await cache?.put(
      CACHE_KEY,
      new Response(JSON.stringify(snapshot), {
        headers: { 'content-type': 'application/json', 'Cache-Control': CACHE_CONTROL },
      })
    );
  } catch {
    // Caching is best-effort.
  }
  return snapshot;
}
