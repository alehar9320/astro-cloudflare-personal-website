import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { parseVisitGlance, shouldShowVisitCount } from '../../utils/visit-stats';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

const jsonHeaders = {
  'content-type': 'application/json',
  'Cache-Control': 'public, max-age=300',
  ...securityHeaders,
} as const;

const emptyHeaders = {
  'Cache-Control': 'no-store',
  ...securityHeaders,
} as const;

export const prerender = false;

interface VisitEnv {
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
}

const DEFAULT_PROJECT_ID = '171414';
const DEFAULT_QUERY_HOST = 'https://eu.posthog.com';
const QUERY_TIMEOUT_MS = 5000;
export const HOGQL = `SELECT
  count() AS pageviews,
  uniq(distinct_id) AS unique_visitors,
  min(timestamp) AS first_seen,
  countIf(timestamp >= now() - INTERVAL 7 DAY) AS pageviews_7d,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 7 DAY) AS unique_visitors_7d,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 1 DAY) AS unique_visitors_1d,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 2 DAY AND timestamp < now() - INTERVAL 1 DAY) AS unique_visitors_1d_prev,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 14 DAY AND timestamp < now() - INTERVAL 7 DAY) AS unique_visitors_7d_prev,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 30 DAY) AS unique_visitors_30d,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 60 DAY AND timestamp < now() - INTERVAL 30 DAY) AS unique_visitors_30d_prev,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 365 DAY) AS unique_visitors_365d,
  uniqIf(distinct_id, timestamp >= now() - INTERVAL 730 DAY AND timestamp < now() - INTERVAL 365 DAY) AS unique_visitors_365d_prev
FROM events
WHERE event = '$pageview' AND timestamp >= toDateTime('1970-01-01 00:00:00')`;

function empty204() {
  return new Response(null, { status: 204, headers: emptyHeaders });
}

function readVisitEnv(): VisitEnv {
  try {
    if (env && typeof env === 'object') return env as VisitEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

export const GET: APIRoute = async () => {
  try {
    const bindings = readVisitEnv();
    const personalKey = bindings.POSTHOG_PERSONAL_API_KEY?.trim();
    if (!personalKey) {
      console.error({ event: 'visits_key_missing' });
      return empty204();
    }

    const projectId = (bindings.POSTHOG_PROJECT_ID || DEFAULT_PROJECT_ID).trim();
    if (!/^\d+$/.test(projectId)) {
      console.error({ event: 'visits_invalid_project_id' });
      return empty204();
    }

    let host: string;
    try {
      const parsed = new URL((bindings.POSTHOG_QUERY_HOST || DEFAULT_QUERY_HOST).trim());
      if (parsed.protocol !== 'https:') {
        console.error({ event: 'visits_invalid_host' });
        return empty204();
      }
      host = parsed.origin;
    } catch {
      console.error({ event: 'visits_invalid_host' });
      return empty204();
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);

    try {
      const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${personalKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            kind: 'HogQLQuery',
            query: HOGQL,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error({ event: 'visits_query_failed' });
        return empty204();
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        console.error({ event: 'visits_query_invalid' });
        return empty204();
      }

      const glance = parseVisitGlance(payload);
      if (!glance || !shouldShowVisitCount(glance.uniqueVisitors)) {
        console.error({ event: 'visits_count_hidden' });
        return empty204();
      }

      return new Response(JSON.stringify(glance), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch (error: unknown) {
      console.error({ event: 'visits_query_failed', error: String(error) });
      return empty204();
    } finally {
      clearTimeout(timeout);
    }
  } catch (error: unknown) {
    console.error({ event: 'visits_query_failed', error: String(error) });
    return empty204();
  }
};
