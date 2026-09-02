import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, HOGQL } from '../pages/api/visits';

type VisitEnv = {
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

const mockValidPosthogResponse = {
  columns: [
    'pageviews',
    'unique_visitors',
    'first_seen',
    'pageviews_7d',
    'unique_visitors_7d',
    'unique_visitors_1d',
    'unique_visitors_1d_prev',
    'unique_visitors_7d_prev',
    'unique_visitors_30d',
    'unique_visitors_30d_prev',
    'unique_visitors_365d',
    'unique_visitors_365d_prev',
  ],
  results: [[1000, 250, '2023-01-01T00:00:00.000Z', 100, 25, 5, 4, 20, 90, 80, 500, 400]],
};

describe('visits API', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bindings = workerEnv as VisitEnv;
    delete bindings.POSTHOG_PERSONAL_API_KEY;
    delete bindings.POSTHOG_PROJECT_ID;
    delete bindings.POSTHOG_QUERY_HOST;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when POSTHOG_PROJECT_ID is invalid (non-numeric)', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';
    bindings.POSTHOG_PROJECT_ID = 'invalid-123-abc';

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when POSTHOG_QUERY_HOST is not an HTTPS URL', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';
    bindings.POSTHOG_QUERY_HOST = 'http://insecure.posthog.com';

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when POSTHOG_QUERY_HOST is an unparseable URL string', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';
    bindings.POSTHOG_QUERY_HOST = ':::not-a-valid-url:::';

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when PostHog query request returns non-OK status', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Forbidden', { status: 403 })));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when PostHog response contains invalid JSON', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not-valid-json', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when parsed glance indicates count should be hidden', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';

    const zeroVisitorPayload = {
      ...mockValidPosthogResponse,
      results: [[0, 0, '2023-01-01T00:00:00.000Z', 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(zeroVisitorPayload), { status: 200 }))
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when fetch throws a network exception or aborts', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 200 with VisitGlance payload when PostHog returns valid data', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_test_key';
    bindings.POSTHOG_PROJECT_ID = '99999';
    bindings.POSTHOG_QUERY_HOST = 'https://us.posthog.com';

    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(mockValidPosthogResponse), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');

    const data = await response.json();
    expect(data).toEqual({
      pageviews: 1000,
      uniqueVisitors: 250,
      firstSeen: '2023-01-01T00:00:00.000Z',
      pageviews7d: 100,
      uniqueVisitors7d: 25,
      uniqueVisitorsDoD: 25,
      uniqueVisitorsWoW: 25,
      uniqueVisitorsMoM: 12.5,
      uniqueVisitorsYoY: 25,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://us.posthog.com/api/projects/99999/query/',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer phx_test_key',
          'content-type': 'application/json',
        },
      })
    );
  });
});
