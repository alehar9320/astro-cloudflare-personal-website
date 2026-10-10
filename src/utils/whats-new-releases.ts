import { z } from 'zod';
import { fetchGitHubReleasesResult, SiteReleaseSchema, type SiteRelease } from './github-releases';

/**
 * Releases for /whats-new/ SSR (#1579 follow-up).
 *
 * A failed GitHub fetch (unauthenticated 60/h per egress IP, 403/429, 5xx, network,
 * timeout) used to look like an empty list. The page then fell back to a stale snapshot
 * that is older than 30 days, so This week and Last 30 days disappeared on about half of
 * the requests. Here a failure is never an empty list:
 * - `fresh`: GitHub answered. A non-empty list is stored as the last good result.
 * - `cached`: a last good result younger than FRESH_MS is reused without calling GitHub.
 * - `stale`: GitHub failed; the last good result is served instead.
 * - `error`: GitHub failed and there is no last good result. Never cached.
 */
export type WhatsNewReleases =
  | { state: 'fresh' | 'cached' | 'stale'; releases: SiteRelease[] }
  | { state: 'error'; releases: [] };

/** Minimal Cache API surface (Workers `caches.default`). */
export interface ReleasesCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export interface LoadWhatsNewReleasesOptions {
  cache?: ReleasesCache;
  fetchImpl?: typeof fetch;
  now?: number;
  token?: string;
}

/** Synthetic Cache API key; never fetched over the network. */
export const LAST_GOOD_CACHE_KEY = 'https://me.alehar.workers.dev/__cache/whats-new-releases-v1';
/** Reuse the last good list without calling GitHub for this long (eases the 60/h limit). */
export const FRESH_MS = 2 * 60 * 1000;
/** Keep the last good list as an error fallback for this long. */
export const LAST_GOOD_TTL_S = 7 * 24 * 60 * 60;

const CachedEntrySchema = z.object({
  releases: z.array(SiteReleaseSchema).min(1),
  storedAt: z.number(),
});

/** Workers `caches.default`, or undefined off-Workers (tests, Node). */
export function defaultReleasesCache(): ReleasesCache | undefined {
  return (globalThis as { caches?: { default?: ReleasesCache } }).caches?.default;
}

async function readLastGood(
  cache: ReleasesCache | undefined
): Promise<z.infer<typeof CachedEntrySchema> | null> {
  if (!cache) return null;
  try {
    const hit = await cache.match(new Request(LAST_GOOD_CACHE_KEY));
    if (!hit) return null;
    const parsed = CachedEntrySchema.safeParse(await hit.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function writeLastGood(
  cache: ReleasesCache | undefined,
  releases: SiteRelease[],
  now: number
): Promise<void> {
  if (!cache || releases.length === 0) return;
  try {
    await cache.put(
      new Request(LAST_GOOD_CACHE_KEY),
      new Response(JSON.stringify({ releases, storedAt: now }), {
        headers: {
          'Cache-Control': `max-age=${LAST_GOOD_TTL_S}`,
          'content-type': 'application/json',
        },
      })
    );
  } catch (error: unknown) {
    console.error({ event: 'whats_new_cache_put_failed', error: String(error) });
  }
}

export async function loadWhatsNewReleases(
  options: LoadWhatsNewReleasesOptions = {}
): Promise<WhatsNewReleases> {
  const { cache, fetchImpl = fetch, now = Date.now(), token } = options;
  const lastGood = await readLastGood(cache);
  if (lastGood && now - lastGood.storedAt < FRESH_MS) {
    return { state: 'cached', releases: lastGood.releases };
  }

  const result = await fetchGitHubReleasesResult(
    fetchImpl,
    undefined,
    token ? { token } : undefined
  );
  if (result.ok) {
    await writeLastGood(cache, result.releases, now);
    return { state: 'fresh', releases: result.releases };
  }

  console.error({
    event: 'whats_new_releases_unavailable',
    fallback: lastGood ? 'last_good' : 'none',
    reason: result.reason,
    status: result.status,
  });
  if (lastGood) return { state: 'stale', releases: lastGood.releases };
  return { state: 'error', releases: [] };
}
