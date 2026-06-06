import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  RELEASES_PAGE_URL,
  fetchGitHubReleases,
  formatReleaseDate,
  normalizeRelease,
  splitReleaseBody,
} from '../utils/github-releases';

describe('github releases utility', () => {
  beforeEach(() => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('sessionStorage', undefined);
  });

  it('normalizes published releases', () => {
    expect(
      normalizeRelease({
        body: '- feat: add release feed',
        html_url: 'https://github.com/example/release',
        name: '2026.05.28.0401',
        published_at: '2026-04-06T14:00:00Z',
        tag_name: '2026.05.28.0401',
      })
    ).toEqual({
      body: '- feat: add release feed',
      publishedAt: '2026-04-06T14:00:00Z',
      title: '2026.05.28.0401',
      url: 'https://github.com/example/release',
      version: '2026.05.28.0401',
    });
  });

  it('filters out invalid or draft releases', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { draft: true, tag_name: 'draft-release' },
        { prerelease: true, tag_name: 'beta-release' },
        { body: '- feat: ship', html_url: RELEASES_PAGE_URL, tag_name: '2026.05.28.0401' },
      ],
    });

    await expect(fetchGitHubReleases(fetchMock as typeof fetch)).resolves.toEqual([
      {
        body: '- feat: ship',
        publishedAt: null,
        title: '2026.05.28.0401',
        url: RELEASES_PAGE_URL,
        version: '2026.05.28.0401',
      },
    ]);
  });

  it('handles API validation failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ tag_name: 123 }], // invalid tag_name (number instead of string)
    });

    const result = await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'github_releases_validation_failed',
        issues: expect.any(Array),
      })
    );

    // Ensure sensitive keys 'received' and 'value' are NOT in the logged issues
    const loggedCall = consoleSpy.mock.calls[0][0];
    const firstIssue = loggedCall.issues[0];
    expect(firstIssue).not.toHaveProperty('received');
    expect(firstIssue).not.toHaveProperty('value');
  });

  it('returns an empty list when the GitHub API fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'));

    await expect(fetchGitHubReleases(fetchMock as typeof fetch)).resolves.toEqual([]);
  });

  it('handles non-OK responses from the GitHub API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Map([
        ['x-ratelimit-limit', '60'],
        ['x-ratelimit-remaining', '0'],
        ['x-ratelimit-reset', '1234567890'],
      ]),
    });

    await expect(fetchGitHubReleases(fetchMock as typeof fetch)).resolves.toEqual([]);
  });

  it('splits markdown bullet bodies into release items and handles various markers', () => {
    const body = '- feat: one\n* fix: two\n+ docs: three\n\n# Header to skip\nPlain line';
    expect(splitReleaseBody(body)).toEqual([
      { message: 'feat: one' },
      { message: 'fix: two' },
      { message: 'docs: three' },
    ]);
  });

  it('ignores lines without valid list markers', () => {
    const body = 'Just text\n- List item\nNot a list item\n### Heading';
    expect(splitReleaseBody(body)).toEqual([{ message: 'List item' }]);
  });

  it('parses commit hashes from release items with various markers', () => {
    const body =
      '* 8acc628 ✍️ Scribe: Strategic Copy Optimization\n+ 1234567 fix: some issue\n- plain message';
    const items = splitReleaseBody(body);

    expect(items).toEqual([
      {
        hash: '8acc628',
        message: '✍️ Scribe: Strategic Copy Optimization',
        url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/commit/8acc628',
      },
      {
        hash: '1234567',
        message: 'fix: some issue',
        url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/commit/1234567',
      },
      {
        message: 'plain message',
      },
    ]);
  });

  it('formats ISO dates for display and guards invalid inputs', () => {
    expect(formatReleaseDate('2026-04-06T14:00:00Z')).toBe('2026-04-06');
    expect(formatReleaseDate('not-a-date')).toBe('Unknown date');
    expect(formatReleaseDate(null)).toBe('Unknown date');
  });

  it('handles normalization edge cases (empty body, missing urls)', () => {
    expect(normalizeRelease({ tag_name: 'v1' })).toEqual({
      body: '',
      publishedAt: null,
      title: 'v1',
      url: RELEASES_PAGE_URL,
      version: 'v1',
    });
  });

  it('uses GITHUB_TOKEN and logs status on error', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('process', { env: { GITHUB_TOKEN: 'test-token' } });
    vi.stubGlobal('window', undefined);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: new Map([['x-ratelimit-limit', '60']]),
    });

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Accept: expect.any(String), Authorization: 'token test-token' },
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'github_releases_request_failed',
        status: 403,
        statusText: 'Forbidden',
      })
    );

    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('handles environment without process global', async () => {
    vi.stubGlobal('process', undefined);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
    vi.unstubAllGlobals();
  });

  it('rejects invalid GitHub API URLs', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn();

    const result = await fetchGitHubReleases(fetchMock as typeof fetch, 'https://malicious.com');

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'github_releases_invalid_url',
        url: 'https://malicious.com',
      })
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redacts tokens from error messages', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error('failed with token ghp_12345abcdef'));

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'github_releases_request_error',
        error: 'Error: failed with token [REDACTED]',
      })
    );
  });

  it('handles non-Error objects in catch block', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue('not an error object');

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'github_releases_request_error',
        error: 'not an error object',
      })
    );
  });

  describe('caching', () => {
    const mockReleases = [
      {
        body: '- feat: ship',
        publishedAt: null,
        title: 'v1',
        url: RELEASES_PAGE_URL,
        version: 'v1',
      },
    ];

    it('returns cached data if available and not expired', async () => {
      vi.stubGlobal('window', {});
      const getItem = vi.fn().mockReturnValue(
        JSON.stringify({
          data: mockReleases,
          timestamp: Date.now() - 1000,
        })
      );
      vi.stubGlobal('sessionStorage', { getItem });

      const fetchMock = vi.fn();
      const result = await fetchGitHubReleases(fetchMock as typeof fetch);

      expect(result).toEqual(mockReleases);
      expect(getItem).toHaveBeenCalledWith('github-releases-cache');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches and saves to cache if cache is expired', async () => {
      vi.stubGlobal('window', {});
      const getItem = vi.fn().mockReturnValue(
        JSON.stringify({
          data: [],
          timestamp: Date.now() - 3600 * 1000 - 1,
        })
      );
      const setItem = vi.fn();
      vi.stubGlobal('sessionStorage', { getItem, setItem });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ body: '- feat: ship', html_url: RELEASES_PAGE_URL, tag_name: 'v1' }],
      });

      const result = await fetchGitHubReleases(fetchMock as typeof fetch);

      expect(result).toEqual(mockReleases);
      expect(setItem).toHaveBeenCalledWith('github-releases-cache', expect.any(String));
    });

    it('handles cache read errors gracefully', async () => {
      vi.stubGlobal('window', {});
      const getItem = vi.fn().mockImplementation(() => {
        throw new Error('access denied');
      });
      vi.stubGlobal('sessionStorage', { getItem });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ body: '- feat: ship', html_url: RELEASES_PAGE_URL, tag_name: 'v1' }],
      });

      const result = await fetchGitHubReleases(fetchMock as typeof fetch);

      expect(result).toEqual(mockReleases);
      expect(fetchMock).toHaveBeenCalledOnce();
    });

    it('handles cache write errors gracefully', async () => {
      vi.stubGlobal('window', {});
      const setItem = vi.fn().mockImplementation(() => {
        throw new Error('storage full');
      });
      vi.stubGlobal('sessionStorage', { getItem: vi.fn().mockReturnValue(null), setItem });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ body: '- feat: ship', html_url: RELEASES_PAGE_URL, tag_name: 'v1' }],
      });

      const result = await fetchGitHubReleases(fetchMock as typeof fetch);

      expect(result).toEqual(mockReleases);
      expect(fetchMock).toHaveBeenCalledOnce();
    });
  });
});
