import { afterEach, describe, expect, it, vi } from 'vitest';

import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import { fetchGitHubReleasesResult } from '../utils/github-releases';
import { toVisitorRelease } from '../utils/visitor-changelog';
import { buildWhatsNewGlance } from '../utils/whats-new-glance';
import {
  defaultReleasesCache,
  FRESH_MS,
  LAST_GOOD_CACHE_KEY,
  loadWhatsNewReleases,
  type ReleasesCache,
} from '../utils/whats-new-releases';

const NOW = Date.parse('2026-10-10T12:00:00Z');

const apiRelease = {
  body: '- abc1234 fix(chat): give laptop open chat a conversation stage under the header (#939)',
  draft: false,
  html_url:
    'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.10.09.0900',
  name: '2026.10.09.0900',
  prerelease: false,
  published_at: '2026-10-09T09:00:00Z',
  tag_name: '2026.10.09.0900',
};

function memoryCache() {
  const store = new Map<string, string>();
  const cache: ReleasesCache = {
    match: vi.fn(async (request: Request) => {
      const hit = store.get(request.url);
      return hit === undefined ? undefined : new Response(hit);
    }),
    put: vi.fn(async (request: Request, response: Response) => {
      store.set(request.url, await response.text());
    }),
  };
  return { cache, store };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

function glanceFor(releases: Parameters<typeof buildWhatsNewGlance>[0]) {
  return buildWhatsNewGlance(releases, new Date(NOW));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('What’s New releases: a failed GitHub fetch is not an empty list (#1579)', () => {
  it('tells a 403 rate limit apart from a genuinely empty release list', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const limited = await fetchGitHubReleasesResult(
      vi.fn(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403))
    );
    const empty = await fetchGitHubReleasesResult(vi.fn(async () => jsonResponse([])));
    const offline = await fetchGitHubReleasesResult(
      vi.fn(async () => {
        throw new TypeError('fetch failed');
      })
    );
    expect(limited).toEqual({ ok: false, reason: 'http', status: 403 });
    expect(empty).toEqual({ ok: true, releases: [] });
    expect(offline).toEqual({ ok: false, reason: 'network' });
  });

  it.each([
    ['403', async () => jsonResponse({ message: 'API rate limit exceeded' }, 403)],
    ['429', async () => jsonResponse({ message: 'Too many requests' }, 429)],
    [
      'a rejected fetch',
      async () => {
        throw new TypeError('fetch failed');
      },
    ],
  ])('with no last good list, %s yields the error state and caches nothing', async (_, impl) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { cache } = memoryCache();
    const loaded = await loadWhatsNewReleases({ cache, fetchImpl: vi.fn(impl), now: NOW });
    expect(loaded).toEqual({ state: 'error', releases: [] });
    expect(cache.put).not.toHaveBeenCalled();
    // The old path fell back to the >30-day snapshot, which renders no sections at all.
    expect(glanceFor([toVisitorRelease(LATEST_RELEASE_SNAPSHOT)])).toEqual({
      groups: [],
      thisWeek: [],
    });
  });

  it('serves the last good list when GitHub later fails, so the sections still render', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { cache } = memoryCache();
    const ok = await loadWhatsNewReleases({
      cache,
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      now: NOW,
    });
    expect(ok.state).toBe('fresh');
    expect(cache.put).toHaveBeenCalledTimes(1);

    const failing = vi.fn(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403));
    const later = await loadWhatsNewReleases({
      cache,
      fetchImpl: failing,
      now: NOW + FRESH_MS + 1,
    });
    expect(failing).toHaveBeenCalledTimes(1);
    expect(later.state).toBe('stale');
    expect(later.releases).toEqual(ok.releases);
    expect(cache.put).toHaveBeenCalledTimes(1);

    const glance = glanceFor(later.releases.map((release) => toVisitorRelease(release)));
    expect(glance.thisWeek).toEqual([
      'Give laptop open chat a conversation stage under the header',
    ]);
  });

  it('reuses a fresh last good list without calling GitHub', async () => {
    const { cache } = memoryCache();
    await loadWhatsNewReleases({
      cache,
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      now: NOW,
    });
    const fetchImpl = vi.fn(async () => jsonResponse([apiRelease]));
    const loaded = await loadWhatsNewReleases({ cache, fetchImpl, now: NOW + FRESH_MS - 1 });
    expect(loaded.state).toBe('cached');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('never caches an empty list', async () => {
    const { cache, store } = memoryCache();
    const loaded = await loadWhatsNewReleases({
      cache,
      fetchImpl: vi.fn(async () => jsonResponse([])),
      now: NOW,
    });
    expect(loaded).toEqual({ state: 'fresh', releases: [] });
    expect(cache.put).not.toHaveBeenCalled();
    expect(store.has(LAST_GOOD_CACHE_KEY)).toBe(false);
  });

  it('sends the token and a timeout signal to GitHub', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse([apiRelease]));
    await loadWhatsNewReleases({ fetchImpl, now: NOW, token: 'abc' });
    const init = fetchImpl.mock.calls[0][1];
    expect((init?.headers as Record<string, string>).Authorization).toBe('token abc');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('uses caches.default on Workers and nothing off-Workers', () => {
    expect(defaultReleasesCache()).toBeUndefined();
    const { cache } = memoryCache();
    vi.stubGlobal('caches', { default: cache });
    try {
      expect(defaultReleasesCache()).toBe(cache);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('treats a broken cache as no cache and still renders a fresh list', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const cache: ReleasesCache = {
      match: vi.fn(async () => {
        throw new Error('cache down');
      }),
      put: vi.fn(async () => {
        throw new Error('cache down');
      }),
    };
    const loaded = await loadWhatsNewReleases({
      cache,
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      now: NOW,
    });
    expect(loaded.state).toBe('fresh');
    expect(errors).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'whats_new_cache_put_failed' })
    );
  });

  it('ignores a malformed cache entry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { cache, store } = memoryCache();
    store.set(LAST_GOOD_CACHE_KEY, JSON.stringify({ releases: [], storedAt: NOW }));
    const loaded = await loadWhatsNewReleases({
      cache,
      fetchImpl: vi.fn(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403)),
      now: NOW,
    });
    expect(loaded).toEqual({ state: 'error', releases: [] });
  });
});
