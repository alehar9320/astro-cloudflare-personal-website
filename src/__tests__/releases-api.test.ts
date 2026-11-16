import { env as workerEnv } from 'cloudflare:workers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../pages/api/releases';
import type { SiteRelease } from '../utils/github-releases';
import { toVisitorRelease } from '../utils/visitor-changelog';
import * as whatsNewReleases from '../utils/whats-new-releases';

type GetContext = Parameters<typeof GET>[0];

function createContext(request = new Request('https://example.com/api/releases')) {
  return {
    request,
    locals: {},
  } as unknown as GetContext;
}

const apiRelease = {
  body: '- 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)',
  draft: false,
  html_url:
    'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
  name: '2026.08.16.2111',
  prerelease: false,
  published_at: '2026-08-16T21:12:02Z',
  tag_name: '2026.08.16.2111',
};

const mockRelease: SiteRelease = {
  body: '- 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)',
  publishedAt: '2026-08-16T21:12:02Z',
  title: '2026.08.16.2111',
  url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
  version: '2026.08.16.2111',
};

/** The hardcoded Aug 15 stub (src/data/latest-release.ts) must never be served. */
const AUG_15_STUB_VERSION = '2026.08.15.1720';

const bindings = workerEnv as { CHAT_STORE?: KVNamespace };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

function stubGitHub(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Run the real loader with a fixed build snapshot so a local build output cannot leak in. */
function withSnapshot(snapshot: SiteRelease[]) {
  const real = whatsNewReleases.loadWhatsNewReleases;
  vi.spyOn(whatsNewReleases, 'loadWhatsNewReleases').mockImplementation((options = {}) =>
    real({ ...options, snapshot })
  );
}

describe('releases API route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    whatsNewReleases.resetWhatsNewReleasesMemory();
    delete bindings.CHAT_STORE;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete bindings.CHAT_STORE;
  });

  it('returns formatted visitor releases from GitHub', async () => {
    withSnapshot([]);
    stubGitHub(async () => jsonResponse([apiRelease]));

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');

    const json = await response.json();
    expect(json).toEqual([toVisitorRelease(mockRelease)]);
  });

  it('returns an empty list when GitHub returns an empty list', async () => {
    withSnapshot([]);
    stubGitHub(async () => jsonResponse([]));

    const response = await GET(createContext());
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([]);
  });

  it('returns the KV or snapshot list when GitHub fails, not the Aug 15 stub', async () => {
    withSnapshot([]);
    stubGitHub(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403));
    bindings.CHAT_STORE = {
      get: vi.fn(async (key: string) =>
        key === whatsNewReleases.RELEASES_KV_KEY
          ? JSON.stringify({ storedAt: 0, releases: [mockRelease] })
          : null
      ),
      put: vi.fn(async () => undefined),
    } as unknown as KVNamespace;

    const fromKv = await (await GET(createContext())).json();
    expect(fromKv).toEqual([toVisitorRelease(mockRelease)]);
    expect(JSON.stringify(fromKv)).not.toContain(AUG_15_STUB_VERSION);

    delete bindings.CHAT_STORE;
    whatsNewReleases.resetWhatsNewReleasesMemory();
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    withSnapshot([mockRelease]);

    const fromSnapshot = await (await GET(createContext())).json();
    expect(fromSnapshot).toEqual([toVisitorRelease(mockRelease)]);
    expect(JSON.stringify(fromSnapshot)).not.toContain(AUG_15_STUB_VERSION);
  });

  it('returns [] when GitHub fails and there is no KV entry or snapshot', async () => {
    withSnapshot([]);
    stubGitHub(async () => {
      throw new TypeError('fetch failed');
    });

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60');

    const json = await response.json();
    expect(json).toEqual([]);
  });
});
