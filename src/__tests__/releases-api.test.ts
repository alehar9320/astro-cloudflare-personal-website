import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, type ReleasesEnv } from '../pages/api/releases';
import * as githubReleases from '../utils/github-releases';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';

describe('releases API', () => {
  beforeEach(() => {
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.GITHUB_TOKEN;
    vi.restoreAllMocks();
  });

  it('returns fetched releases transformed with visitor titles and security headers', async () => {
    const mockReleases: githubReleases.SiteRelease[] = [
      {
        version: 'v1.0.0',
        title: 'Release 1.0.0',
        body: '- chore: update dependencies\n- feat: add new feature',
        publishedAt: '2026-01-01T00:00:00Z',
        url: 'https://github.com/releases/v1.0.0',
      },
    ];

    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue(mockReleases);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');

    const data = (await response.json()) as githubReleases.SiteRelease[];
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe('v1.0.0');
    expect(data[0].body).toContain('Update dependencies');
  });

  it('passes GITHUB_TOKEN from worker env to fetchGitHubReleases when available', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = '  secret-token-123  ';

    const fetchSpy = vi
      .spyOn(githubReleases, 'fetchGitHubReleases')
      .mockResolvedValue([LATEST_RELEASE_SNAPSHOT]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(Function), undefined, {
      token: 'secret-token-123',
    });
  });

  it('falls back to LATEST_RELEASE_SNAPSHOT if fetchGitHubReleases returns empty array', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const data = (await response.json()) as githubReleases.SiteRelease[];
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('catches errors, logs telemetry, and falls back to LATEST_RELEASE_SNAPSHOT', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('Network error'));

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const data = (await response.json()) as githubReleases.SiteRelease[];
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'releases_api_error',
        error: 'Error: Network error',
      })
    );
  });
});
