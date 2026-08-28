import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET } from '../pages/api/releases';
import * as githubReleases from '../utils/github-releases';
import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import { toVisitorRelease } from '../utils/visitor-changelog';

type GetContext = Parameters<typeof GET>[0];

function createContext(request = new Request('https://example.com/api/releases')) {
  return {
    request,
    locals: {},
  } as unknown as GetContext;
}

const mockRelease: githubReleases.SiteRelease = {
  body: '- 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)',
  publishedAt: '2026-08-16T21:12:02Z',
  title: '2026.08.16.2111',
  url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
  version: '2026.08.16.2111',
};

describe('releases API route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns formatted visitor releases from GitHub', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([mockRelease]);

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const json = await response.json();
    expect(json).toEqual([toVisitorRelease(mockRelease)]);
  });

  it('falls back to LATEST_RELEASE_SNAPSHOT if GitHub releases are empty', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);

    const response = await GET(createContext());
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([toVisitorRelease(LATEST_RELEASE_SNAPSHOT)]);
  });

  it('handles errors gracefully by falling back to LATEST_RELEASE_SNAPSHOT', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockRejectedValue(new Error('GitHub error'));

    const response = await GET(createContext());
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([toVisitorRelease(LATEST_RELEASE_SNAPSHOT)]);
  });
});
