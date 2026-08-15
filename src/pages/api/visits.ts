import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { shouldShowVisitCount } from '../../utils/visit-stats';

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
const HOGQL =
  "SELECT count() AS pageviews FROM events WHERE event = '$pageview' AND timestamp >= toDateTime('1970-01-01 00:00:00')";

function empty204() {
  return new Response(null, { status: 204, headers: emptyHeaders });
}

function parsePageviews(payload: unknown): number | null {
  if (!payload || typeof payload !== 'object') return null;
  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;

  const row = results[0];
  let raw: unknown;

  if (typeof row === 'number' || typeof row === 'string') {
    raw = row;
  } else if (Array.isArray(row)) {
    raw = row[0];
  } else if (row && typeof row === 'object' && 'pageviews' in row) {
    raw = (row as { pageviews: unknown }).pageviews;
  } else {
    return null;
  }

  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
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

      const count = parsePageviews(payload);
      if (!shouldShowVisitCount(count)) {
        console.error({ event: 'visits_count_hidden' });
        return empty204();
      }

      return new Response(JSON.stringify({ pageviews: count }), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch {
      console.error({ event: 'visits_query_failed' });
      return empty204();
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    console.error({ event: 'visits_query_failed' });
    return empty204();
  }
};
