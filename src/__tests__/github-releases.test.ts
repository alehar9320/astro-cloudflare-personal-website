import { describe, expect, it, vi } from 'vitest';

import {
  RELEASES_PAGE_URL,
  fetchGitHubReleases,
  formatReleaseDate,
  normalizeRelease,
  splitReleaseBody,
} from '../utils/github-releases';

describe('github releases utility', () => {
  it('normalizes published releases', () => {
    expect(
      normalizeRelease({
        body: '- feat: add release feed',
        html_url: 'https://github.com/example/release',
        name: '2026.04.06.1400',
        published_at: '2026-04-06T14:00:00Z',
        tag_name: '2026.04.06.1400',
      })
    ).toEqual({
      body: '- feat: add release feed',
      publishedAt: '2026-04-06T14:00:00Z',
      title: '2026.04.06.1400',
      url: 'https://github.com/example/release',
      version: '2026.04.06.1400',
    });
  });

  it('handles missing optional fields in normalizeRelease', () => {
    expect(
      normalizeRelease({
        tag_name: '2026.04.06.1400',
      })
    ).toEqual({
      body: '',
      publishedAt: null,
      title: '2026.04.06.1400',
      url: RELEASES_PAGE_URL,
      version: '2026.04.06.1400',
    });

    expect(
      normalizeRelease({
        tag_name: '2026.04.06.1400',
        body: null,
        html_url: undefined,
      })
    ).toEqual({
      body: '',
      publishedAt: null,
      title: '2026.04.06.1400',
      url: RELEASES_PAGE_URL,
      version: '2026.04.06.1400',
    });
  });

  it('filters out invalid or draft releases', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { draft: true, tag_name: 'draft-release' },
        { prerelease: true, tag_name: 'beta-release' },
        { body: '- feat: ship', html_url: RELEASES_PAGE_URL, tag_name: '2026.04.06.1400' },
      ],
    });

    await expect(fetchGitHubReleases(fetchMock as typeof fetch)).resolves.toEqual([
      {
        body: '- feat: ship',
        publishedAt: null,
        title: '2026.04.06.1400',
        url: RELEASES_PAGE_URL,
        version: '2026.04.06.1400',
      },
    ]);
  });

  it('returns an empty list when the GitHub API fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'));

    await expect(fetchGitHubReleases(fetchMock as typeof fetch)).resolves.toEqual([]);
  });

  it('uses GITHUB_TOKEN when present in environment', async () => {
    const originalToken = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = 'test-token';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'token test-token',
        }),
      })
    );
    process.env.GITHUB_TOKEN = originalToken;
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

  it('splits markdown bullet bodies into plain list items', () => {
    expect(splitReleaseBody('- feat: one\n- fix: two\n\n- docs: three')).toEqual([
      'feat: one',
      'fix: two',
      'docs: three',
    ]);
  });

  it('formats ISO dates for display and guards invalid inputs', () => {
    expect(formatReleaseDate('2026-04-06T14:00:00Z')).toBe('2026-04-06');
    expect(formatReleaseDate('not-a-date')).toBe('Unknown date');
    expect(formatReleaseDate(null)).toBe('Unknown date');
  });
});
