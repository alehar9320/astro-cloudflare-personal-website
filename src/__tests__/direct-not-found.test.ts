import { describe, expect, it, vi } from 'vitest';

import { fetchDirectNotFound, isDirectNotFoundPath, withNotFoundStatus } from '../direct-not-found';

describe('direct-not-found helpers', () => {
  describe('isDirectNotFoundPath', () => {
    it('identifies /404 and /404/ paths', () => {
      expect(isDirectNotFoundPath('/404')).toBe(true);
      expect(isDirectNotFoundPath('/404/')).toBe(true);
      expect(isDirectNotFoundPath('/')).toBe(false);
      expect(isDirectNotFoundPath('/404-page')).toBe(false);
      expect(isDirectNotFoundPath('/work')).toBe(false);
    });
  });

  describe('withNotFoundStatus', () => {
    it('returns the existing response if status is already 404', () => {
      const original = new Response('Custom 404', { status: 404 });
      const result = withNotFoundStatus(original);
      expect(result).toBe(original);
      expect(result.status).toBe(404);
    });

    it('wraps non-404 responses in a 404 status response preserving body and headers', async () => {
      const original = new Response('Page Body', {
        status: 200,
        headers: { 'x-custom-header': 'test-val' },
      });
      const result = withNotFoundStatus(original);
      expect(result).not.toBe(original);
      expect(result.status).toBe(404);
      expect(result.statusText).toBe('Not Found');
      expect(result.headers.get('x-custom-header')).toBe('test-val');
      expect(await result.text()).toBe('Page Body');
    });
  });

  describe('fetchDirectNotFound', () => {
    it('fetches /404 asset and returns response with 404 status', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue(new Response('404 Page Content', { status: 200 }));
      const assets = { fetch: mockFetch };
      const request = new Request('https://alexanderharenstam.com/non-existent-page');

      const response = await fetchDirectNotFound(request, assets);

      expect(mockFetch).toHaveBeenCalledWith(new URL('https://alexanderharenstam.com/404'));
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('404 Page Content');
    });
  });
});
