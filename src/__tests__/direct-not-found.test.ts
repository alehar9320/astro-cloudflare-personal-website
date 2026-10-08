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
      expect(isDirectNotFoundPath('/work/123')).toBe(false);
      expect(isDirectNotFoundPath('/4040')).toBe(false);
    });
  });

  describe('withNotFoundStatus', () => {
    it('returns the same response if status is already 404', () => {
      const response = new Response('Already 404', { status: 404 });
      const result = withNotFoundStatus(response);
      expect(result).toBe(response);
      expect(result.status).toBe(404);
    });

    it('returns a new Response with status 404 if status is not 404', async () => {
      const originalHeaders = new Headers({ 'content-type': 'text/html' });
      const response = new Response('Page content', {
        status: 200,
        headers: originalHeaders,
      });
      const result = withNotFoundStatus(response);

      expect(result).not.toBe(response);
      expect(result.status).toBe(404);
      expect(result.statusText).toBe('Not Found');
      expect(result.headers.get('content-type')).toBe('text/html');
      expect(await result.text()).toBe('Page content');
    });
  });

  describe('fetchDirectNotFound', () => {
    it('fetches /404 asset from assets handler and sets status 404', async () => {
      const mockFetch = vi.fn().mockImplementation(async (reqOrUrl) => {
        const urlStr = typeof reqOrUrl === 'string' ? reqOrUrl : reqOrUrl.toString();
        expect(urlStr).toBe('https://example.com/404');
        return new Response('404 HTML body', { status: 200 });
      });

      const request = new Request('https://example.com/404/');
      const response = await fetchDirectNotFound(request, { fetch: mockFetch });

      expect(mockFetch).toHaveBeenCalledOnce();
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('404 HTML body');
    });
  });
});
