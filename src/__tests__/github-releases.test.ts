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
});
