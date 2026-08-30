import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    vi.restoreAllMocks();
  });

  afterEach(() => {
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
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when project ID is non-numeric', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';
    bindings.POSTHOG_PROJECT_ID = 'invalid-123';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_invalid_project_id' });
  });

  it('returns 204 when query host is non-https or malformed', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';

    bindings.POSTHOG_QUERY_HOST = 'http://insecure.posthog.com';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    let response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_invalid_host' });

    bindings.POSTHOG_QUERY_HOST = 'not-a-valid-url';
    response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when PostHog API request fails or throws', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as unknown as Response);

    let response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_query_failed' });

    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network Error'));
    response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });

  it('returns 204 when response payload is not valid JSON or parseVisitGlance returns null', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Response);

    let response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_query_invalid' });

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as unknown as Response);

    response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_count_hidden' });
  });

  it('returns 204 when uniqueVisitors is 0 or negative', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // uniqueVisitors is 0 (shouldShowVisitCount returns false)
    const mockHogQLResponse = {
      results: [[0, 0, '2023-01-01 00:00:00', 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHogQLResponse),
    } as unknown as Response);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
    expect(console.error).toHaveBeenCalledWith({ event: 'visits_count_hidden' });
  });

  it('returns 200 with JSON payload when query succeeds and unique visitors threshold is met', async () => {
    const bindings = workerEnv as VisitEnv;
    bindings.POSTHOG_PERSONAL_API_KEY = 'phx_testkey123';

    const mockHogQLResponse = {
      results: [[150, 50, '2023-01-01 00:00:00', 20, 10, 5, 4, 8, 25, 20, 45, 40]],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHogQLResponse),
    } as unknown as Response);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const data = await response.json();
    expect(data).toMatchObject({
      pageviews: 150,
      uniqueVisitors: 50,
      firstSeen: '2023-01-01T00:00:00.000Z',
    });
  });
});
