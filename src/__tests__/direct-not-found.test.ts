import { describe, expect, it } from 'vitest';

import { fetchDirectNotFound, isDirectNotFoundPath, withNotFoundStatus } from '../direct-not-found';

describe('direct-not-found utility', () => {
  it('identifies direct 404 paths correctly', () => {
    expect(isDirectNotFoundPath('/404')).toBe(true);
    expect(isDirectNotFoundPath('/404/')).toBe(true);
    expect(isDirectNotFoundPath('/')).toBe(false);
    expect(isDirectNotFoundPath('/work')).toBe(false);
  });

  it('preserves response when status is already 404', () => {
    const original = new Response('not found', { status: 404 });
    const result = withNotFoundStatus(original);
    expect(result).toBe(original);
  });

  it('converts non-404 status to 404', () => {
    const original = new Response('ok', { status: 200, headers: { 'x-test': '1' } });
    const result = withNotFoundStatus(original);
    expect(result.status).toBe(404);
    expect(result.statusText).toBe('Not Found');
    expect(result.headers.get('x-test')).toBe('1');
  });

  it('fetches direct 404 asset and applies status 404', async () => {
    const mockAssets = {
      fetch: async (input: Request | URL | string) => {
        const url =
          typeof input === 'string' ? input : input instanceof Request ? input.url : input.href;
        expect(url).toBe('https://me.alehar.workers.dev/404');
        return new Response('custom 404', { status: 200 });
      },
    };
    const req = new Request('https://me.alehar.workers.dev/about');
    const res = await fetchDirectNotFound(req, mockAssets);
    expect(res.status).toBe(404);
    expect(await res.text()).toBe('custom 404');
  });
});
