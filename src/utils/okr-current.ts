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
  /** TEMP diagnostic (#1727): short failure code, never a secret. */
  reason?: string;
};

export type OkrSnapshot = {
  metrics: Record<string, OkrMetric>;
  generatedAt: string;
  /** TEMP diagnostic (#1727). */
  error?: string;
};

type OkrEnv = {
  GITHUB_TOKEN?: string;
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

export const NO_DATA = 'No data yet';
const CACHE_KEY = 'https://me.alehar.workers.dev/__okr-snapshot-v1';
const CACHE_CONTROL = 'max-age=3600';
const UPSTREAM_TIMEOUT_MS = 5000; // matches /api/visits (Nick-approved change from the spec's 3000)
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

const UPDATED_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/Stockholm',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZoneName: 'short',
};

/**
 * Stockholm time with a short zone, e.g. '13 Oct 2026, 15:41 CEST'. Explicit fields
 * only: dateStyle/timeStyle cannot be combined with timeZoneName (RangeError).
 * Returns '' when the value cannot be formatted, so the page shows 'Updated —'.
 */
export function formatUpdated(iso: string): string {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', UPDATED_FORMAT_OPTIONS).format(date);
  } catch {
    return '';
  }
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

/** Short, secret-free reason for a failed upstream call (status, timeout, shape). */
function failReason(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === 'AbortError') return 'timeout';
    return err.message.slice(0, 80);
  }
  return 'unknown';
}

function settle(
  id: string,
  source: OkrMetric['source'],
  result: PromiseSettledResult<{ value: number | null; valueLabel: string }>,
  updatedAt: string
): OkrMetric {
  if (result.status === 'rejected') {
    const reason = failReason(result.reason);
    console.warn({ event: 'okr_metric_failed', id, source, reason });
    return { ...empty(id, source), reason };
  }
  const { value, valueLabel } = result.value;
  return { id, value, valueLabel, source, updatedAt: value === null ? null : updatedAt };
}

async function githubMetrics(bindings: OkrEnv, now: Date): Promise<OkrMetric[]> {
  const ids = ['KR3.1', 'KR3.2', 'KR3.3'];
  const token = bindings.GITHUB_TOKEN?.trim();
  if (!token) {
    console.warn({ event: 'okr_source_unconfigured', source: 'GitHub', reason: 'no token' });
    return ids.map((id) => empty(id, 'GitHub'));
  }
  const since7 = isoDaysAgo(7, now);
  const since30 = isoDaysAgo(30, now);
  const count = (n: number) => ({ value: n, valueLabel: String(n) });
  const [merged7, open, rate] = await Promise.allSettled([
    githubCount(`${REPO}+is:pr+is:merged+base:main+merged:%3E%3D${since7}`, token).then(count),
    githubCount(`${REPO}+is:pr+is:open`, token).then(count),
    Promise.all([
      githubCount(`${REPO}+is:pr+is:merged+merged:%3E%3D${since30}`, token),
      githubCount(`${REPO}+is:pr+is:closed+is:unmerged+closed:%3E%3D${since30}`, token),
    ]).then(([merged30, closedUnmerged30]) => {
      const r = closeRate(merged30, closedUnmerged30);
      return { value: r, valueLabel: formatPercent(r) };
    }),
  ]);
  const updatedAt = new Date().toISOString();
  return [
    settle('KR3.1', 'GitHub', merged7, updatedAt),
    settle('KR3.2', 'GitHub', open, updatedAt),
    settle('KR3.3', 'GitHub', rate, updatedAt),
  ];
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
  if (typeof item?.value !== 'number' || !Number.isFinite(item.value))
    throw new Error('posthog shape');
  return item.value;
}

async function posthogMetrics(bindings: OkrEnv): Promise<OkrMetric[]> {
  const ids = ['KR1.1', 'KR1.2', 'KR2.2'];
  const unconfigured = (reason: string) => {
    console.warn({ event: 'okr_source_unconfigured', source: 'PostHog', reason });
    return ids.map((id) => ({ ...empty(id, 'PostHog'), reason }));
  };
  const key = bindings.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = (bindings.POSTHOG_PROJECT_ID || DEFAULT_PROJECT_ID).trim();
  let host: string;
  try {
    const parsed = new URL((bindings.POSTHOG_QUERY_HOST || DEFAULT_QUERY_HOST).trim());
    if (parsed.protocol !== 'https:') return unconfigured('host not https');
    host = parsed.origin;
  } catch {
    return unconfigured('invalid host');
  }
  if (!key) return unconfigured('no key');
  if (!/^\d+$/.test(projectId)) return unconfigured('invalid project id');
  const count = (payload: unknown) => {
    const n = firstCell(payload);
    return { value: n, valueLabel: String(n) };
  };
  // One query at a time (Nick-approved): PostHog may reject concurrent queries per key.
  const settled = async <T>(run: () => Promise<T>): Promise<PromiseSettledResult<T>> => {
    try {
      return { status: 'fulfilled', value: await run() };
    } catch (reason) {
      return { status: 'rejected', reason };
    }
  };
  const visitors = await settled(() =>
    posthogQuery(host, projectId, key, hogql(KR11_HOGQL)).then(count)
  );
  const bounce = await settled(() =>
    posthogQuery(host, projectId, key, KR12_WEB_OVERVIEW).then((payload) => {
      const b = bounceRate(payload);
      return { value: b, valueLabel: formatPercent(b) };
    })
  );
  const hire = await settled(() =>
    posthogQuery(host, projectId, key, hogql(KR22_HOGQL)).then(count)
  );

  const updatedAt = new Date().toISOString();
  return [
    settle('KR1.1', 'PostHog', visitors, updatedAt),
    settle('KR1.2', 'PostHog', bounce, updatedAt),
    settle('KR2.2', 'PostHog', hire, updatedAt),
  ];
}

function getCache(): Cache | null {
  try {
    const c = (globalThis as { caches?: { default?: Cache } }).caches?.default;
    return c ?? null;
  } catch {
    return null;
  }
}

export const SNAPSHOT_TTL_MS = 3_600_000;
export const NO_DATA_TTL_MS = 60_000;

/**
 * Module-scope cache (per isolate). `caches.default` is a no-op on *.workers.dev,
 * so this is the layer that actually stops every page load from hitting GitHub
 * and PostHog. Snapshots with any 'No data yet' metric are kept for 60 s only.
 */
let memo: { snapshot: OkrSnapshot; expiresAt: number } | null = null;
let inflight: Promise<OkrSnapshot> | null = null;

/** Test hook: forget the in-memory snapshot and any in-flight build. */
export function resetOkrSnapshotCache(): void {
  memo = null;
  inflight = null;
}

function hasNoData(snapshot: OkrSnapshot): boolean {
  const metrics = Object.values(snapshot.metrics);
  return metrics.length === 0 || metrics.some((m) => m.value === null);
}

async function buildSnapshot(): Promise<OkrSnapshot> {
  try {
    const bindings = readEnv();
    const now = new Date();
    const [gh, ph] = await Promise.all([githubMetrics(bindings, now), posthogMetrics(bindings)]);
    const metrics: Record<string, OkrMetric> = {};
    for (const m of [...ph, ...gh]) metrics[m.id] = m;
    return { metrics, generatedAt: new Date().toISOString() };
  } catch (err) {
    return {
      metrics: {},
      generatedAt: new Date().toISOString(),
      error: `build:${failReason(err)}`,
    };
  }
}

async function loadSnapshot(): Promise<OkrSnapshot> {
  const cache = getCache();
  try {
    const hit = await cache?.match(CACHE_KEY);
    if (hit) return (await hit.json()) as OkrSnapshot;
  } catch {
    // Cache API miss or unavailable (no-op on *.workers.dev); build below.
  }
  const snapshot = await buildSnapshot();
  if (!hasNoData(snapshot)) {
    try {
      await cache?.put(
        CACHE_KEY,
        new Response(JSON.stringify(snapshot), {
          headers: { 'content-type': 'application/json', 'Cache-Control': CACHE_CONTROL },
        })
      );
    } catch {
      // Extra layer only; best-effort.
    }
  }
  return snapshot;
}

/** Hourly cached snapshot (memory → Cache API → upstream). Never throws. */
export async function getOkrSnapshot(): Promise<OkrSnapshot> {
  if (memo && Date.now() < memo.expiresAt) return memo.snapshot;
  if (inflight) return inflight;
  const pending = loadSnapshot()
    .catch(
      (err) =>
        ({
          metrics: {},
          generatedAt: new Date().toISOString(),
          error: `load:${failReason(err)}`,
        }) as OkrSnapshot
    )
    .then((snapshot) => {
      const ttl = hasNoData(snapshot) ? NO_DATA_TTL_MS : SNAPSHOT_TTL_MS;
      memo = { snapshot, expiresAt: Date.now() + ttl };
      return snapshot;
    })
    .finally(() => {
      if (inflight === pending) inflight = null;
    });
  inflight = pending;
  return pending;
}
