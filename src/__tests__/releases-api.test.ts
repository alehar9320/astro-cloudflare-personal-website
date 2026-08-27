import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, type ReleasesEnv } from '../pages/api/releases';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import * as githubReleases from '../utils/github-releases';

describe('releases API endpoint GET', () => {
  beforeEach(() => {
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.GITHUB_TOKEN;
    vi.restoreAllMocks();
  });

  it('returns visitor-formatted releases when GitHub releases are fetched', async () => {
    const mockReleases: githubReleases.SiteRelease[] = [
      {
        version: '2026.05.01.1200',
        title: '2026.05.01.1200',
        publishedAt: '2026-05-01T12:00:00Z',
        url: 'https://github.com/example/repo/releases/tag/2026.05.01.1200',
        body: '- feat: add new dashboard (#100)\n* fix: solve layout bug',
      },
    ];
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue(mockReleases);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe('2026.05.01.1200');
    expect(data[0].body).toContain('- Add new dashboard');
    expect(data[0].body).toContain('- Solve layout bug');
  });

  it('passes GITHUB_TOKEN binding to fetchGitHubReleases if present', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = 'secret-token-123';
    const fetchSpy = vi
      .spyOn(githubReleases, 'fetchGitHubReleases')
      .mockResolvedValue([LATEST_RELEASE_SNAPSHOT]);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);

    expect(fetchSpy).toHaveBeenCalledWith(expect.any(Function), undefined, {
      token: 'secret-token-123',
    });
  });

  it('falls back to snapshot release when GitHub releases array is empty', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('falls back to snapshot release and logs error on exception', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('Network error'));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
    expect(consoleSpy).toHaveBeenCalledWith({
      event: 'releases_api_error',
      error: 'Error: Network error',
    });
  });
});
