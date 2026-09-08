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

  it('logs structured telemetry on query failure and outer catch failure', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({
      event: 'visits_query_failed',
      error: 'Error: Network failure',
    });

    // Test outer catch block
    errorSpy.mockClear();
    class MockAbortController {
      constructor() {
        throw new Error('Outer error');
      }
    }
    vi.stubGlobal('AbortController', MockAbortController);
    const outerResponse = await GET({} as Parameters<typeof GET>[0]);
    vi.unstubAllGlobals();

    expect(outerResponse.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({
      event: 'visits_query_failed',
      error: 'Error: Outer error',
    });
  });

  it('handles response.ok == false', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 500 }));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_query_failed' });
  });

  it('handles json parse error on response payload', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('invalid-json', { status: 200 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_query_invalid' });
  });

  it('handles hidden count / invalid glance payload', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ result: [] }), { status: 200 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_count_hidden' });
  });

  it('handles invalid POSTHOG_PROJECT_ID format', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_PROJECT_ID = 'invalid-id';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_invalid_project_id' });
  });

  it('handles non-HTTPS POSTHOG_QUERY_HOST', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_QUERY_HOST = 'http://insecure.posthog.com';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_invalid_host' });
  });

  it('handles malformed POSTHOG_QUERY_HOST URL', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_QUERY_HOST = 'not-a-valid-url';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(errorSpy).toHaveBeenCalledWith({ event: 'visits_invalid_host' });
  });

  it('uses custom POSTHOG_PROJECT_ID and POSTHOG_QUERY_HOST in fetch request', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    bindings.POSTHOG_PROJECT_ID = '999999';
    bindings.POSTHOG_QUERY_HOST = 'https://us.posthog.com';

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [[100, 50, '2023-01-01', 10, 5, 2, 1, 4, 20, 15, 40, 30]],
        }),
        { status: 200 }
      )
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://us.posthog.com/api/projects/999999/query/',
      expect.any(Object)
    );
  });

  it('returns 200 with visit glance data on valid response', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
    const validData = {
      results: [[100, 50, '2023-01-01', 10, 5, 2, 1, 4, 20, 15, 40, 30]],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validData), { status: 200 })
    );

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('pageviews', 100);
    expect(body).toHaveProperty('uniqueVisitors', 50);
  });
});
