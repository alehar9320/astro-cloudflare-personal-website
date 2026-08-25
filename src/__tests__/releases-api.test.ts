import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, type ReleasesEnv } from '../pages/api/releases';
import * as githubReleases from '../utils/github-releases';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';

type GetContext = Parameters<typeof GET>[0];

const mockRelease: githubReleases.SiteRelease = {
  version: '2026.08.15.1714',
  title: '2026.08.15.1714',
  body: 'Header line\n- feat: test change (#123)',
  url: 'https://github.com/example/repo/releases/tag/2026.08.15.1714',
  publishedAt: '2026-08-15T17:14:07Z',
};

describe('releases API', () => {
  beforeEach(() => {
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.GITHUB_TOKEN;
    vi.restoreAllMocks();
  });

  it('fetches GitHub releases and formats visitor release titles and bullets', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([mockRelease]);
    const response = await GET({} as GetContext);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('cache-control')).toBe('public, max-age=60');

    const data = (await response.json()) as Array<{ version: string; body: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe('2026.08.15.1714');
    expect(data[0].body).toContain('Test change');
    expect(data[0].body).not.toContain('(#123)');
  });

  it('passes GITHUB_TOKEN from Cloudflare worker environment bindings', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = 'secret-token';

    const fetchSpy = vi
      .spyOn(githubReleases, 'fetchGitHubReleases')
      .mockResolvedValue([mockRelease]);
    await GET({} as GetContext);

    expect(fetchSpy).toHaveBeenCalledWith(expect.any(Function), undefined, {
      token: 'secret-token',
    });
  });

  it('falls back to LATEST_RELEASE_SNAPSHOT when GitHub returns no releases', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);
    const response = await GET({} as GetContext);

    expect(response.status).toBe(200);
    const data = (await response.json()) as Array<{ version: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('logs structured telemetry error and falls back to LATEST_RELEASE_SNAPSHOT on failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('Network error'));

    const response = await GET({} as GetContext);

    expect(response.status).toBe(200);
    const data = (await response.json()) as Array<{ version: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);

    expect(consoleSpy).toHaveBeenCalledWith({
      event: 'releases_api_error',
      error: 'Error: Network error',
    });
  });
});
