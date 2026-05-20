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

  it('handles API validation failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ tag_name: 123 }], // invalid tag_name (number instead of string)
    });

    const result = await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'GitHub releases API validation failed:',
      expect.any(Object)
    );
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
      'GitHub releases request failed',
      expect.objectContaining({ status: 403, statusText: 'Forbidden' })
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
    expect(consoleSpy).toHaveBeenCalledWith('Invalid GitHub API URL');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redacts tokens from error messages', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error('failed with token ghp_12345abcdef'));

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(consoleSpy).toHaveBeenCalledWith(
      'GitHub releases request errored:',
      'failed with token [REDACTED]'
    );
  });

  it('handles non-Error objects in catch block', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue('not an error object');

    await fetchGitHubReleases(fetchMock as typeof fetch);

    expect(consoleSpy).toHaveBeenCalledWith('GitHub releases request errored:', 'Unknown error');
  });

  it('handles normalizeRelease edge cases: undefined tag_name', () => {
    // @ts-expect-error Testing invalid input
    expect(normalizeRelease({ tag_name: undefined })).toBeNull();
  });

  it('handles normalizeRelease edge cases: whitespace name', () => {
    const release = normalizeRelease({ tag_name: 'v1.0.0', name: '   ' });
    expect(release?.title).toBe('v1.0.0');
  });

  it('handles normalizeRelease edge cases: missing html_url', () => {
    const release = normalizeRelease({ tag_name: 'v1.0.0' });
    expect(release?.url).toBe(RELEASES_PAGE_URL);
  });

  it('handles splitReleaseBody with empty body', () => {
    expect(splitReleaseBody('')).toEqual([]);
  });
});
