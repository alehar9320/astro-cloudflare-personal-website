import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import { fetchGitHubReleasesResult, type SiteRelease } from '../utils/github-releases';
import { toVisitorRelease } from '../utils/visitor-changelog';
import { buildWhatsNewGlance } from '../utils/whats-new-glance';
import {
  FRESH_MS,
  loadWhatsNewReleases,
  RELEASES_KV_FRESH_MS,
  RELEASES_KV_KEY,
  RELEASES_KV_TTL_SECONDS,
  parseReleasesSnapshot,
  resetWhatsNewReleasesMemory,
  shouldShowUpdatesUnavailable,
  UPDATES_UNAVAILABLE_COPY,
  type WhatsNewReleases,
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
const SNAPSHOT: SiteRelease[] = parseReleasesSnapshot([apiRelease]);

const OLD: SiteRelease[] = parseReleasesSnapshot([
  { ...apiRelease, published_at: '2026-08-15T17:20:18Z' },
]);

/** In-memory stand-in for the CHAT_STORE KV binding. */
function memoryKv(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  const get = vi.fn(async (key: string) => store.get(key) ?? null);
  const put = vi.fn(async (key: string, value: string) => {
    store.set(key, value);
  });
  return { get, put, kv: { get, put } as unknown as KVNamespace };
}

const rateLimited = async () => jsonResponse({ message: 'API rate limit exceeded' }, 403);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

function render(loaded: WhatsNewReleases) {
  const glance = buildWhatsNewGlance(
    loaded.releases.map((release) => toVisitorRelease(release)),
    new Date(NOW)
  );
  return { glance, unavailable: shouldShowUpdatesUnavailable(loaded, glance) };
}

beforeEach(() => {
  resetWhatsNewReleasesMemory();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('What’s New releases: a failed GitHub fetch is not an empty list (#1579)', () => {
  it('tells a 403 rate limit apart from a genuinely empty release list', async () => {
    const limited = await fetchGitHubReleasesResult(vi.fn(rateLimited));
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
    ['403', rateLimited],
    ['429', async () => jsonResponse({ message: 'Too many requests' }, 429)],
    [
      'a rejected fetch',
      async () => {
        throw new TypeError('fetch failed');
      },
    ],
  ])('with no fallback, %s yields the error state and the unavailable line', async (_, impl) => {
    const loaded = await loadWhatsNewReleases({ fetchImpl: vi.fn(impl), now: NOW, snapshot: [] });
    expect(loaded).toEqual({ state: 'error', releases: [] });
    expect(render(loaded).unavailable).toBe(true);
    // The old path fell back to the >30-day snapshot, which renders no sections at all.
    expect(buildWhatsNewGlance([LATEST_RELEASE_SNAPSHOT], new Date(NOW))).toEqual({
      groups: [],
      thisWeek: [],
    });
  });

  it('serves the build-time snapshot when GitHub fails on a cold isolate', async () => {
    const loaded = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      now: NOW,
      snapshot: SNAPSHOT,
    });
    expect(loaded.state).toBe('snapshot');
    const { glance, unavailable } = render(loaded);
    expect(glance.thisWeek).toEqual([
      'On a laptop, open chat sits under the header instead of covering the whole page',
    ]);
    expect(unavailable).toBe(false);
  });

  function expectAug15LatestOnly(loaded: WhatsNewReleases) {
    const { glance, unavailable } = render(loaded);
    expect(unavailable).toBe(false);
    expect(glance.latest?.datetime).toBe('2026-08-15');
    expect(glance.latest?.label).toBe('Last updated 15 Aug 2026');
    expect(glance.groups).toEqual([]);
    expect(glance.thisWeek).toEqual([]);
  }

  it("under snapshot, Latest updates still renders its date and the can't-load banner stays hidden (supersedes #1579)", async () => {
    const loaded = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      now: NOW,
      snapshot: OLD,
    });
    expect(loaded.state).toBe('snapshot');
    expectAug15LatestOnly(loaded);
  });

  it("under stale, Latest updates still renders its date and the can't-load banner stays hidden", async () => {
    await loadWhatsNewReleases({
      fetchImpl: vi.fn(async () =>
        jsonResponse([{ ...apiRelease, published_at: '2026-08-15T17:20:18Z' }])
      ),
      now: NOW,
      snapshot: [],
    });
    const loaded = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      now: NOW + FRESH_MS + 1,
      snapshot: [],
    });
    expect(loaded.state).toBe('stale');
    expect(loaded.releases).toEqual(OLD);
    expectAug15LatestOnly(loaded);
  });

  it("under a KV hit (cached), Latest updates still renders its date and the can't-load banner stays hidden", async () => {
    const { kv } = memoryKv({
      [RELEASES_KV_KEY]: JSON.stringify({
        storedAt: NOW - RELEASES_KV_FRESH_MS - 1,
        releases: OLD,
      }),
    });
    const loaded = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      kv,
      now: NOW,
      snapshot: [],
    });
    expect(loaded).toEqual({ state: 'cached', releases: OLD });
    expectAug15LatestOnly(loaded);
  });

  it('a successful fetch writes CHAT_STORE and a later failing fetch serves it as cached', async () => {
    const { get, kv, put } = memoryKv();
    const first = await loadWhatsNewReleases({
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      kv,
      now: NOW,
      snapshot: [],
    });
    expect(first.state).toBe('fresh');
    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith(
      'whats-new-releases:v1',
      JSON.stringify({ storedAt: NOW, releases: first.releases }),
      { expirationTtl: 86400 }
    );
    expect(RELEASES_KV_KEY).toBe('whats-new-releases:v1');
    expect(RELEASES_KV_TTL_SECONDS).toBe(86400);

    resetWhatsNewReleasesMemory();
    const later = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      kv,
      now: NOW + RELEASES_KV_FRESH_MS + 1,
      snapshot: [],
    });
    expect(later).toEqual({ state: 'cached', releases: first.releases });
    // Only the releases key is touched in the shared store.
    for (const [key] of [...get.mock.calls, ...put.mock.calls]) {
      expect(key).toBe(RELEASES_KV_KEY);
    }
  });

  it('within the 10-minute KV freshness window, GitHub is not called', async () => {
    const { kv } = memoryKv({
      [RELEASES_KV_KEY]: JSON.stringify({ storedAt: NOW, releases: SNAPSHOT }),
    });
    const fetchImpl = vi.fn(async () => jsonResponse([apiRelease]));
    const loaded = await loadWhatsNewReleases({
      fetchImpl,
      kv,
      now: NOW + RELEASES_KV_FRESH_MS - 1,
      snapshot: [],
    });
    expect(loaded).toEqual({ state: 'cached', releases: SNAPSHOT });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it.each([
    ['invalid JSON', '{not json'],
    ['an empty list', JSON.stringify({ storedAt: NOW, releases: [] })],
  ])('treats %s in KV as a miss and never writes a failed list', async (_, raw) => {
    const { kv, put } = memoryKv({ [RELEASES_KV_KEY]: raw });
    const loaded = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      kv,
      now: NOW,
      snapshot: [],
    });
    expect(loaded).toEqual({ state: 'error', releases: [] });
    expect(render(loaded).unavailable).toBe(true);
    expect(put).not.toHaveBeenCalled();
  });

  it('adds no cached or out-of-date chip or badge', () => {
    expect(UPDATES_UNAVAILABLE_COPY).toBe(
      "Recent updates can't load right now. The full history is on GitHub."
    );
    const page = readFileSync('src/pages/whats-new.astro', 'utf8');
    expect(page).toMatch(
      /<p class="latest-date">\s*<time datetime=\{glance\.latest\.datetime\}>\{glance\.latest\.label\}<\/time>\s*<\/p>/
    );
    const start = page.indexOf(
      '<section class="this-week" aria-labelledby="latest-updates-heading"'
    );
    expect(start).toBeGreaterThan(-1);
    const latestSection = page.slice(start, page.indexOf('</section>', start));
    expect(latestSection).not.toMatch(/cached|may be out of date/i);
  });

  it('works on *.workers.dev, where caches.default is a no-op', async () => {
    // On workers.dev the Cache API accepts put() and never returns a match.
    const noOpCache = {
      match: vi.fn(async () => undefined),
      put: vi.fn(async () => undefined),
    };
    vi.stubGlobal('caches', { default: noOpCache });

    const first = await loadWhatsNewReleases({
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      now: NOW,
      snapshot: [],
    });
    expect(first.state).toBe('fresh');

    const failing = vi.fn(rateLimited);
    const later = await loadWhatsNewReleases({
      fetchImpl: failing,
      now: NOW + FRESH_MS + 1,
      snapshot: [],
    });
    expect(failing).toHaveBeenCalledTimes(1);
    expect(later.state).toBe('stale');
    expect(later.releases).toEqual(first.releases);
    expect(render(later).glance.thisWeek).toEqual([
      'On a laptop, open chat sits under the header instead of covering the whole page',
    ]);
    expect(noOpCache.match).not.toHaveBeenCalled();
    expect(noOpCache.put).not.toHaveBeenCalled();
  });

  it('reuses a fresh last good list without calling GitHub', async () => {
    await loadWhatsNewReleases({
      fetchImpl: vi.fn(async () => jsonResponse([apiRelease])),
      now: NOW,
    });
    const fetchImpl = vi.fn(async () => jsonResponse([apiRelease]));
    const loaded = await loadWhatsNewReleases({ fetchImpl, now: NOW + FRESH_MS - 1 });
    expect(loaded.state).toBe('cached');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('never remembers an empty list, and an empty list is not an error', async () => {
    const empty = await loadWhatsNewReleases({
      fetchImpl: vi.fn(async () => jsonResponse([])),
      now: NOW,
      snapshot: [],
    });
    expect(empty).toEqual({ state: 'fresh', releases: [] });
    expect(render(empty).unavailable).toBe(false);

    const later = await loadWhatsNewReleases({
      fetchImpl: vi.fn(rateLimited),
      now: NOW + 1,
      snapshot: [],
    });
    expect(later.state).toBe('error');
  });

  it('sends the token and a timeout signal to GitHub', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse([apiRelease]));
    await loadWhatsNewReleases({ fetchImpl, now: NOW, token: 'abc' });
    const init = fetchImpl.mock.calls[0][1];
    expect((init?.headers as Record<string, string>).Authorization).toBe('token abc');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('parses the build snapshot like the live API and drops drafts, prereleases and junk', () => {
    expect(
      parseReleasesSnapshot([
        apiRelease,
        { ...apiRelease, tag_name: 'pre', prerelease: true },
        { ...apiRelease, tag_name: 'draft', draft: true },
      ]).map((release) => release.version)
    ).toEqual(['2026.10.09.0900']);
    expect(parseReleasesSnapshot({ not: 'an array' })).toEqual([]);
  });

  it('pins Eden’s unavailable copy, with no API, rate-limit, token or retry wording', () => {
    expect(UPDATES_UNAVAILABLE_COPY).toBe(
      "Recent updates can't load right now. The full history is on GitHub."
    );
    expect(UPDATES_UNAVAILABLE_COPY).not.toMatch(/\bapi\b|rate|limit|token|try again|retry/i);
  });
});
