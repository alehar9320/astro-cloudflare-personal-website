import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, type ReleasesEnv } from '../pages/api/releases';
import * as githubReleases from '../utils/github-releases';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';

type ReleaseJson = { version: string; body: string };

describe('releases API', () => {
  beforeEach(() => {
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.GITHUB_TOKEN;
    vi.restoreAllMocks();
  });

  it('returns visitor-formatted releases fetched from GitHub', async () => {
    const sampleRelease: githubReleases.SiteRelease = {
      version: '2026.01.01.1200',
      title: '2026.01.01.1200',
      publishedAt: '2026-01-01T12:00:00Z',
      url: 'https://github.com/test/test/releases/tag/v1.0.0',
      body: '- feat: add interactive component (#100)\nNon-bullet title line',
    };
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([sampleRelease]);

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');

    const data = (await response.json()) as ReleaseJson[];
    expect(data).toHaveLength(1);
    expect(data[0]?.version).toBe('2026.01.01.1200');
    expect(data[0]?.body).toContain('- Add interactive component');
  });

  it('passes GITHUB_TOKEN options when set in environment', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = 'secret-token';

    const spy = vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);
    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(spy).toHaveBeenCalledWith(expect.any(Function), undefined, { token: 'secret-token' });

    const data = (await response.json()) as ReleaseJson[];
    expect(data).toHaveLength(1);
    expect(data[0]?.version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('handles fetch exceptions by logging telemetry and returning snapshot fallback', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('Network error'));

    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith({
      event: 'releases_api_error',
      error: 'Error: Network error',
    });

    const data = (await response.json()) as ReleaseJson[];
    expect(data).toHaveLength(1);
    expect(data[0]?.version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });
});
