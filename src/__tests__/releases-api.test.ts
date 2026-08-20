import { describe, expect, it, vi } from 'vitest';
import { GET } from '../pages/api/releases';

vi.mock('../utils/github-releases', () => ({
  fetchGitHubReleases: vi.fn(),
}));

import { fetchGitHubReleases } from '../utils/github-releases';

describe('releases API', () => {
  it('returns formatted releases with security and caching headers', async () => {
    const mockReleases = [
      {
        version: 'v1.0.0',
        title: 'v1.0.0',
        body: '- feat: rewrite What’s New for visitors (#524)\nHeader line',
        publishedAt: '2026-05-20T10:00:00Z',
        url: 'https://github.com/example/releases/tag/v1.0.0',
      },
    ];

    vi.mocked(fetchGitHubReleases).mockResolvedValueOnce(mockReleases);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');

    const data = (await response.json()) as Array<{ version: string; body: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe('v1.0.0');
    expect(data[0].body).toContain('What’s New rewritten for visitors');
  });

  it('handles exceptions gracefully and returns empty array on error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(fetchGitHubReleases).mockRejectedValueOnce(new Error('Fetch failed'));

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'releases_api_error' })
    );

    consoleErrorSpy.mockRestore();
  });
});
