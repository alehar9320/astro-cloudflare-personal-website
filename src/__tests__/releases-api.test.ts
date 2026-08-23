import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env as workerEnv } from 'cloudflare:workers';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import { GET, type ReleasesEnv } from '../pages/api/releases';

vi.mock('../utils/github-releases', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/github-releases')>();
  return {
    ...actual,
    fetchGitHubReleases: vi.fn(),
  };
});

import { fetchGitHubReleases, type SiteRelease } from '../utils/github-releases';

type ReleasesAPIContext = Parameters<typeof GET>[0];

describe('releases API endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.GITHUB_TOKEN;
  });

  it('returns visitor formatted releases when fetchGitHubReleases succeeds', async () => {
    const mockRelease = {
      version: '2026.08.15.1200',
      title: '2026.08.15.1200',
      publishedAt: '2026-08-15T12:00:00Z',
      url: 'https://github.com/example/release',
      body: '- feat: add new feature\n* fix: solve issue\nSome title text',
    };

    vi.mocked(fetchGitHubReleases).mockResolvedValue([mockRelease]);

    const response = await GET({} as ReleasesAPIContext);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('Strict-Transport-Security')).toBe(
      'max-age=31536000; includeSubDomains'
    );
    expect(response.headers.get('Content-Security-Policy')).toBe(
      "default-src 'none'; frame-ancestors 'none';"
    );

    const data = (await response.json()) as SiteRelease[];
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].version).toBe('2026.08.15.1200');
    expect(data[0].body).toContain('- Add new feature');
    expect(data[0].body).toContain('- Solve issue');
  });

  it('passes GITHUB_TOKEN binding to fetchGitHubReleases if present', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = 'secret-token-123';

    vi.mocked(fetchGitHubReleases).mockResolvedValue([]);

    await GET({} as ReleasesAPIContext);

    expect(fetchGitHubReleases).toHaveBeenCalledWith(expect.any(Function), undefined, {
      token: 'secret-token-123',
    });
  });

  it('falls back to LATEST_RELEASE_SNAPSHOT when fetchGitHubReleases returns an empty array', async () => {
    vi.mocked(fetchGitHubReleases).mockResolvedValue([]);

    const response = await GET({} as ReleasesAPIContext);

    expect(response.status).toBe(200);
    const data = (await response.json()) as SiteRelease[];
    expect(data.length).toBe(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('logs error and falls back to LATEST_RELEASE_SNAPSHOT when fetchGitHubReleases throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(fetchGitHubReleases).mockRejectedValue(new Error('Network error'));

    const response = await GET({} as ReleasesAPIContext);

    expect(response.status).toBe(200);
    const data = (await response.json()) as SiteRelease[];
    expect(data.length).toBe(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'releases_api_error',
        error: expect.stringContaining('Network error'),
      })
    );
  });
});
