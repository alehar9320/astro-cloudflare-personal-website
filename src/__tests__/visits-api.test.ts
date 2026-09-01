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

  it('returns 204 when project ID is invalid', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = 'invalid-abc';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when query host is not HTTPS or is invalid', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    bindings.POSTHOG_QUERY_HOST = 'http://insecure.com';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);

    bindings.POSTHOG_QUERY_HOST = 'not-a-valid-url';
    const response2 = await GET({} as Parameters<typeof GET>[0]);
    expect(response2.status).toBe(204);
  });

  it('returns 204 when PostHog fetch fails or returns non-ok status', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    bindings.POSTHOG_QUERY_HOST = 'https://eu.posthog.com';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Server error', { status: 500 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when PostHog returns invalid JSON response', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('not-json', { status: 200, headers: { 'content-type': 'application/json' } })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when visit count is zero or invalid', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const zeroVisitsPayload = {
      results: [[0, 0, '2023-01-01T00:00:00Z', 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(zeroVisitsPayload), { status: 200 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 200 with visit glance payload when query succeeds', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';

    const validPayload = {
      results: [[1000, 500, '2023-01-01T00:00:00Z', 100, 50, 10, 8, 45, 200, 180, 500, 450]],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validPayload), { status: 200 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('uniqueVisitors', 500);
    expect(json).toHaveProperty('pageviews', 1000);
  });

  it('returns 204 when fetch throws network error', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'valid-key';
    bindings.POSTHOG_PROJECT_ID = '12345';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });
});
