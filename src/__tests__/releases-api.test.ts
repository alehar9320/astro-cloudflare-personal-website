import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import { GET, RELEASES_CACHE_KEY, type ReleasesEnv } from '../pages/api/releases';
import * as githubReleases from '../utils/github-releases';
import { toVisitorRelease } from '../utils/visitor-changelog';

describe('releases API', () => {
  const mockRelease: githubReleases.SiteRelease = {
    body: '- 1234567 feat: new feature (#100)',
    publishedAt: '2026-08-15T12:00:00Z',
    title: 'v2026.08.15',
    url: 'https://github.com/example/releases/v2026.08.15',
    version: 'v2026.08.15',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    const bindings = workerEnv as ReleasesEnv;
    delete bindings.CHAT_STORE;
    delete bindings.GITHUB_TOKEN;
  });

  it('fetches GitHub releases and returns visitor-formatted releases', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([mockRelease]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const json = (await response.json()) as githubReleases.SiteRelease[];
    expect(json).toHaveLength(1);
    expect(json[0].version).toBe('v2026.08.15');
    expect(json[0].body).toContain('New feature');
  });

  it('falls back to LATEST_RELEASE_SNAPSHOT when fetchGitHubReleases returns empty', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const json = (await response.json()) as githubReleases.SiteRelease[];
    expect(json).toHaveLength(1);
    expect(json[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });

  it('serves cached releases from CHAT_STORE KV on hit', async () => {
    const cachedVisitorRelease = [toVisitorRelease(mockRelease)];
    const mockGet = vi.fn().mockResolvedValue(JSON.stringify(cachedVisitorRelease));
    const mockPut = vi.fn();

    const bindings = workerEnv as ReleasesEnv;
    bindings.CHAT_STORE = {
      get: mockGet,
      put: mockPut,
    } as unknown as KVNamespace;

    const fetchSpy = vi.spyOn(githubReleases, 'fetchGitHubReleases');

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(mockGet).toHaveBeenCalledWith(RELEASES_CACHE_KEY);
    expect(fetchSpy).not.toHaveBeenCalled();

    const json = (await response.json()) as githubReleases.SiteRelease[];
    expect(json).toEqual(cachedVisitorRelease);
  });

  it('fetches from GitHub and caches in CHAT_STORE KV on cache miss', async () => {
    const mockGet = vi.fn().mockResolvedValue(null);
    const mockPut = vi.fn().mockResolvedValue(undefined);

    const bindings = workerEnv as ReleasesEnv;
    bindings.CHAT_STORE = {
      get: mockGet,
      put: mockPut,
    } as unknown as KVNamespace;

    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([mockRelease]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(mockGet).toHaveBeenCalledWith(RELEASES_CACHE_KEY);
    expect(mockPut).toHaveBeenCalledWith(
      RELEASES_CACHE_KEY,
      expect.any(String),
      expect.objectContaining({ expirationTtl: 3600 })
    );
  });

  it('passes GITHUB_TOKEN binding to fetchGitHubReleases when provided', async () => {
    const bindings = workerEnv as ReleasesEnv;
    bindings.GITHUB_TOKEN = 'worker-secret-token';

    const fetchSpy = vi
      .spyOn(githubReleases, 'fetchGitHubReleases')
      .mockResolvedValue([mockRelease]);

    await GET({} as Parameters<typeof GET>[0]);

    expect(fetchSpy).toHaveBeenCalledWith(expect.any(Function), undefined, {
      token: 'worker-secret-token',
    });
  });

  it('handles KV store errors gracefully and proceeds to fetch and return releases', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockGet = vi.fn().mockRejectedValue(new Error('KV read failure'));

    const bindings = workerEnv as ReleasesEnv;
    bindings.CHAT_STORE = {
      get: mockGet,
      put: vi.fn(),
    } as unknown as KVNamespace;

    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([mockRelease]);

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const json = (await response.json()) as githubReleases.SiteRelease[];
    expect(json).toHaveLength(1);
    expect(json[0].version).toBe('v2026.08.15');
  });

  it('catches fatal errors and returns snapshot fallback release', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('Fatal exception'));

    const response = await GET({} as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    const json = (await response.json()) as githubReleases.SiteRelease[];
    expect(json).toHaveLength(1);
    expect(json[0].version).toBe(LATEST_RELEASE_SNAPSHOT.version);
  });
});
