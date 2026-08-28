import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, HOGQL } from '../pages/api/visits';

type VisitEnv = {
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

describe('visits API', () => {
  beforeEach(() => {
    const bindings = workerEnv as VisitEnv;
    delete bindings.POSTHOG_PERSONAL_API_KEY;
    delete bindings.POSTHOG_PROJECT_ID;
    delete bindings.POSTHOG_QUERY_HOST;
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
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when POSTHOG_PROJECT_ID is non-numeric', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_PROJECT_ID = 'invalid-project';

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when POSTHOG_QUERY_HOST is not https or is invalid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    bindings.POSTHOG_QUERY_HOST = 'http://insecure.example.com';

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);

    bindings.POSTHOG_QUERY_HOST = 'not-a-valid-url';
    const responseInvalid = await GET({} as Parameters<typeof GET>[0]);
    expect(responseInvalid.status).toBe(204);
  });

  it('returns 204 when the query fetch fails or returns non-ok status', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when response json is invalid or zero count', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{invalid-json', { status: 200 }));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 200 with glance JSON when PostHog query succeeds', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';

    const mockResults = [[100, 50, '2024-01-01T00:00:00Z', 20, 10, 2, 1, 5, 30, 25, 50, 45]];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: mockResults }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const data = await response.json();
    expect(data).toMatchObject({
      pageviews: 100,
      uniqueVisitors: 50,
      firstSeen: '2024-01-01T00:00:00.000Z',
    });
  });
});
