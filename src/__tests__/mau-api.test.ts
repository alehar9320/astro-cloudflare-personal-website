import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET } from '../pages/api/mau';
import * as posthogMau from '../utils/posthog-mau';

function createContext(runtimeEnv: unknown = {}) {
  return {
    request: new Request('https://example.com/api/mau'),
    locals: { runtime: { env: runtimeEnv } },
  } as never;
}

function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe('MAU API route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with MAU data', async () => {
    vi.spyOn(posthogMau, 'fetchMAU').mockResolvedValue(1234);

    const response = await GET(createContext());

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    const body = await readJson(response);
    expect(body.mau).toBe(1234);
    expect(body).toHaveProperty('timestamp');
  });

  it('returns 200 when MAU is 0', async () => {
    vi.spyOn(posthogMau, 'fetchMAU').mockResolvedValue(0);

    const response = await GET(createContext());

    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(body.mau).toBe(0);
  });

  it('returns 500 when MAU response validation fails', async () => {
    vi.spyOn(posthogMau, 'fetchMAU').mockResolvedValue(-1);

    const response = await GET(createContext());

    expect(response.status).toBe(500);
    const body = await readJson(response);
    expect(body).toEqual({ error: 'Failed to format MAU data' });
  });

  it('returns 500 when fetchMAU throws', async () => {
    vi.spyOn(posthogMau, 'fetchMAU').mockRejectedValue(new Error('PostHog unreachable'));

    const response = await GET(createContext());

    expect(response.status).toBe(500);
    const body = await readJson(response);
    expect(body).toEqual({ error: 'Failed to retrieve MAU data' });
  });

  it('returns 500 when fetchMAU throws a non-Error value', async () => {
    vi.spyOn(posthogMau, 'fetchMAU').mockRejectedValue('string error');

    const response = await GET(createContext());

    expect(response.status).toBe(500);
    const body = await readJson(response);
    expect(body).toEqual({ error: 'Failed to retrieve MAU data' });
  });
});
