import { describe, expect, it, vi } from 'vitest';

import { fetchDirectNotFound, isDirectNotFoundPath, withNotFoundStatus } from '../direct-not-found';

describe('direct-not-found utility', () => {
  describe('isDirectNotFoundPath', () => {
    it('returns true for /404 and /404/', () => {
      expect(isDirectNotFoundPath('/404')).toBe(true);
      expect(isDirectNotFoundPath('/404/')).toBe(true);
    });

    it('returns false for other paths', () => {
      expect(isDirectNotFoundPath('/')).toBe(false);
      expect(isDirectNotFoundPath('/about')).toBe(false);
      expect(isDirectNotFoundPath('/4040')).toBe(false);
      expect(isDirectNotFoundPath('/work/404')).toBe(false);
    });
  });

  describe('withNotFoundStatus', () => {
    it('returns the same response if status is already 404', () => {
      const response = new Response('Not Found Body', { status: 404 });
      const result = withNotFoundStatus(response);
      expect(result).toBe(response);
    });

    it('returns a new response with status 404 if original status is 200', async () => {
      const headers = new Headers({ 'content-type': 'text/html' });
      const response = new Response('<h1>404 Page</h1>', { status: 200, headers });
      const result = withNotFoundStatus(response);

      expect(result).not.toBe(response);
      expect(result.status).toBe(404);
      expect(result.statusText).toBe('Not Found');
      expect(result.headers.get('content-type')).toBe('text/html');
      expect(await result.text()).toBe('<h1>404 Page</h1>');
    });
  });

  describe('fetchDirectNotFound', () => {
    it('fetches /404 asset and ensures 404 status', async () => {
      const request = new Request('https://me.alehar.workers.dev/non-existent');
      const fetchSpy = vi.fn().mockResolvedValue(new Response('404 HTML', { status: 200 }));
      const assets = { fetch: fetchSpy };

      const response = await fetchDirectNotFound(request, assets);

      expect(fetchSpy).toHaveBeenCalledWith(new URL('https://me.alehar.workers.dev/404'));
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('404 HTML');
    });
  });
});
