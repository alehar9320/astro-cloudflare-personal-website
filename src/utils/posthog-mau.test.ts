import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fetchMAU, MAUApiResponseSchema } from './posthog-mau';

// Helper to create a successful PostHog query API response
function createPostHogResponse(mau: number) {
  return {
    columns: ['mau'],
    results: [[mau]],
  };
}

describe('fetchMAU', () => {
  beforeEach(() => {
    // Set required env vars before each test
    process.env.POSTHOG_PERSONAL_API_KEY = 'test-api-key';
    process.env.PUBLIC_POSTHOG_PROJECT_ID = 'test-project-id';
    process.env.PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com';
  });

  it('returns the MAU count when the API succeeds', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createPostHogResponse(1234)),
    });

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(1234);
  });

  it('returns 0 when the API response has a non-2xx status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
  });

  it('returns 0 when the API returns invalid JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
  });

  it('returns 0 when the API returns an unexpected response shape', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ unexpected: 'shape' }),
    });

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
  });

  it('returns 0 when fetch throws a network error', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
  });

  it('returns 0 when the API key is missing', async () => {
    process.env.POSTHOG_PERSONAL_API_KEY = '';

    const mockFetch = vi.fn();
    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 0 when the project ID is missing', async () => {
    process.env.PUBLIC_POSTHOG_PROJECT_ID = '';

    const mockFetch = vi.fn();
    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls the PostHog API with the correct URL and headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createPostHogResponse(567)),
    });

    await fetchMAU(mockFetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe('https://eu.i.posthog.com/api/projects/test-project-id/query/');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-api-key',
    });

    const body = JSON.parse(options.body);
    expect(body.query.kind).toBe('HogQLQuery');
    expect(body.query.query).toContain('count(distinct person_id)');
    expect(body.query.query).toContain('INTERVAL 30 DAY');
  });

  it('returns 0 when the API response has an error flag', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: true, results: { columns: [], results: [] } }),
    });

    const result = await fetchMAU(mockFetch);
    expect(result).toBe(0);
  });
});

describe('MAUApiResponseSchema', () => {
  it('validates a correct MAU response', () => {
    const result = MAUApiResponseSchema.safeParse({ mau: 1234, timestamp: '2026-01-01T00:00:00Z' });
    expect(result.success).toBe(true);
  });

  it('rejects a negative MAU value', () => {
    const result = MAUApiResponseSchema.safeParse({ mau: -1, timestamp: '2026-01-01T00:00:00Z' });
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer MAU value', () => {
    const result = MAUApiResponseSchema.safeParse({
      mau: 12.34,
      timestamp: '2026-01-01T00:00:00Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing timestamp', () => {
    const result = MAUApiResponseSchema.safeParse({ mau: 100 });
    expect(result.success).toBe(false);
  });
});
