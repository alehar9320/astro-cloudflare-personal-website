import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, HOGQL } from '../pages/api/visits';

type VisitEnv = {
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

const validHogQLResponse = {
  results: [
    {
      pageviews: 120,
      unique_visitors: 45,
      first_seen: '2026-01-01 00:00:00',
      pageviews_7d: 30,
      unique_visitors_7d: 15,
      unique_visitors_1d: 5,
      unique_visitors_1d_prev: 4,
      unique_visitors_7d_prev: 10,
      unique_visitors_30d: 40,
      unique_visitors_30d_prev: 32,
      unique_visitors_365d: 45,
      unique_visitors_365d_prev: 0,
    },
  ],
};

describe('visits API', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    const bindings = workerEnv as VisitEnv;
    delete bindings.POSTHOG_PERSONAL_API_KEY;
    delete bindings.POSTHOG_PROJECT_ID;
    delete bindings.POSTHOG_QUERY_HOST;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('uses one HogQL query for uniques, first seen, 7d splits, and period comparisons', () => {
    expect(HOGQL.match(/SELECT/g)?.length).toBe(1);
    expect(HOGQL).toContain("event = '$pageview'");
    expect(HOGQL).toContain('unique_visitors');
    expect(HOGQL).toContain('first_seen');
    expect(HOGQL).toContain('pageviews_7d');
    expect(HOGQL).toContain('INTERVAL 7 DAY');
    expect(HOGQL).toContain('unique_visitors_1d');
    expect(HOGQL).toContain('unique_visitors_7d_prev');
    expect(HOGQL).toContain('unique_visitors_30d');
    expect(HOGQL).toContain('unique_visitors_365d');
    expect(HOGQL).toContain('INTERVAL 1 DAY');
    expect(HOGQL).toContain('INTERVAL 30 DAY');
    expect(HOGQL).toContain('INTERVAL 365 DAY');
  });

  it('returns 204 when the PostHog key is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_key_missing' });
  });

  it('returns 204 when project ID is invalid (non-numeric)', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = 'invalid-project-id!';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_invalid_project_id' });
  });

  it('returns 204 when query host protocol is not https', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_QUERY_HOST = 'http://insecure.posthog.com';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_invalid_host' });
  });

  it('returns 204 when query host is an unparseable URL', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_QUERY_HOST = 'not-a-url';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_invalid_host' });
  });

  it('returns 204 when PostHog response is not ok', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';

    globalThis.fetch = vi.fn().mockResolvedValue(new Response('Error', { status: 500 }));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_query_failed' });
  });

  it('returns 204 when PostHog response payload is invalid JSON', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('not-json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_query_invalid' });
  });

  it('returns 204 when visit count should be hidden (0 visitors)', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';

    const zeroVisitorsPayload = {
      results: [{ pageviews: 0, unique_visitors: 0, first_seen: '2026-01-01' }],
    };

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(zeroVisitorsPayload), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_count_hidden' });
  });

  it('returns 204 when fetch rejects due to network error or timeout', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network timeout'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(204);
    expect(consoleSpy).toHaveBeenCalledWith({ event: 'visits_query_failed' });
  });

  it('returns 200 with formatted visit glance on success', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = '  phx_secret_key  ';
    bindings.POSTHOG_PROJECT_ID = '99999';
    bindings.POSTHOG_QUERY_HOST = 'https://us.i.posthog.com';

    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validHogQLResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    globalThis.fetch = fetchSpy;

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('Strict-Transport-Security')).toBe(
      'max-age=31536000; includeSubDomains'
    );
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Content-Security-Policy')).toBe(
      "default-src 'none'; frame-ancestors 'none';"
    );

    const data = await response.json();
    expect(data).toEqual({
      pageviews: 120,
      uniqueVisitors: 45,
      firstSeen: '2026-01-01T00:00:00.000Z',
      pageviews7d: 30,
      uniqueVisitors7d: 15,
      uniqueVisitorsDoD: 25,
      uniqueVisitorsWoW: 50,
      uniqueVisitorsMoM: 25,
      uniqueVisitorsYoY: null,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://us.i.posthog.com/api/projects/99999/query/',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer phx_secret_key',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            kind: 'HogQLQuery',
            query: HOGQL,
          },
        }),
      })
    );
  });
});
