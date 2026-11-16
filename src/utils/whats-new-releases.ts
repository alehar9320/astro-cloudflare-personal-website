import { z } from 'zod';
import {
  fetchGitHubReleasesResult,
  GitHubReleaseApiItemSchema,
  normalizeRelease,
  SiteReleaseSchema,
  type SiteRelease,
} from './github-releases';
import { hasGlanceContent, type WhatsNewGlance } from './whats-new-glance';

/**
 * Releases for /whats-new/ SSR (#1579 follow-up).
 *
 * A failed GitHub fetch (unauthenticated 60/h per egress IP, 403/429, 5xx, network,
 * timeout) used to look like an empty list. The page then fell back to a snapshot older
 * than 30 days, so This week and Last 30 days vanished on a large share of requests.
 * Here a failure is never an empty list:
 * - `fresh`: GitHub answered. A non-empty list becomes this isolate's last good list.
 * - `cached`: this isolate's last good list is younger than FRESH_MS, or the list came from
 *   CHAT_STORE KV (`RELEASES_KV_KEY`); GitHub is not called while the KV entry is fresh.
 * - `stale`: GitHub failed; this isolate's last good list is served.
 * - `snapshot`: GitHub failed, the isolate has none and KV has none; the build-time snapshot
 *   is served.
 * - `error`: GitHub failed and there is nothing to fall back to.
 *
 * The Cloudflare Cache API (`caches.default`) is not used: it has no effect on
 * *.workers.dev, which is where prod runs. Isolate memory is best-effort; the
 * build-time snapshot (scripts/snapshot-releases.mjs) is the guaranteed fallback.
 * Empty and failed results are never stored.
 */
export type WhatsNewReleases =
  | { state: 'fresh' | 'cached' | 'stale' | 'snapshot'; releases: SiteRelease[] }
  | { state: 'error'; releases: [] };

export interface LoadWhatsNewReleasesOptions {
  fetchImpl?: typeof fetch;
  now?: number;
  /** Build-time releases; defaults to the generated snapshot bundled into the Worker. */
  snapshot?: SiteRelease[];
  token?: string;
  /** The existing CHAT_STORE binding; only RELEASES_KV_KEY is read or written. */
  kv?: KVNamespace;
}

/** Releases loaded but every line was hidden as dev-shaped (Matt's call (b), #1163). Eden FINAL copy (c), #1699:
 * no GitHub sentence; the history link directly below is the only pointer. */
export const NO_VISITOR_UPDATES_COPY = 'No new updates lately.';

export const UPDATES_UNAVAILABLE_COPY =
  "Recent updates can't load right now. The full history is on GitHub.";

/** Reuse the last good list without calling GitHub for this long (eases the 60/h limit). */
export const FRESH_MS = 2 * 60 * 1000;

/** CHAT_STORE key for the last good releases list (#1776). Shared store: keep this key exact. */
export const RELEASES_KV_KEY = 'whats-new-releases:v1';
export const RELEASES_KV_TTL_SECONDS = 86400;
/** A KV entry younger than this is served without calling GitHub. */
export const RELEASES_KV_FRESH_MS = 10 * 60 * 1000;

interface ReleasesKvEntry {
  storedAt: number;
  releases: SiteRelease[];
}

const ReleasesKvEntrySchema = z.object({
  storedAt: z.number(),
  releases: z.array(SiteReleaseSchema).min(1),
});

/** Invalid JSON, a missing key, an empty list or a KV error is a miss. */
async function readReleasesKv(kv: KVNamespace | undefined): Promise<ReleasesKvEntry | null> {
  if (!kv) return null;
  try {
    const raw = await kv.get(RELEASES_KV_KEY);
    if (!raw) return null;
    const parsed = ReleasesKvEntrySchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

let lastGood: { releases: SiteRelease[]; storedAt: number } | null = null;

/** Test hook: forget this isolate's last good list. */
export function resetWhatsNewReleasesMemory(): void {
  lastGood = null;
}

/** Normalize a raw GitHub API releases array (the build snapshot) into site releases. */
export function parseReleasesSnapshot(raw: unknown): SiteRelease[] {
  const parsed = z.array(GitHubReleaseApiItemSchema).safeParse(raw);
  if (!parsed.success) return [];
  return parsed.data
    .filter((release) => !release.prerelease)
    .map(normalizeRelease)
    .filter((release): release is SiteRelease => release !== null);
}

// Generated at build time and gitignored. The glob is empty when the build fetch failed
// or no build ran (tests), so a missing file never breaks the bundle.
const generated = import.meta.glob<unknown>('../data/releases-snapshot.generated.json', {
  eager: true,
  import: 'default',
});
const BUILD_SNAPSHOT = parseReleasesSnapshot(Object.values(generated)[0] ?? []);

export async function loadWhatsNewReleases(
  options: LoadWhatsNewReleasesOptions = {}
): Promise<WhatsNewReleases> {
  const { fetchImpl = fetch, kv, now = Date.now(), snapshot = BUILD_SNAPSHOT, token } = options;
  if (lastGood && now - lastGood.storedAt < FRESH_MS) {
    return { state: 'cached', releases: lastGood.releases };
  }

  const kvEntry = await readReleasesKv(kv);
  if (kvEntry && now - kvEntry.storedAt < RELEASES_KV_FRESH_MS) {
    lastGood = { releases: kvEntry.releases, storedAt: kvEntry.storedAt };
    return { state: 'cached', releases: kvEntry.releases };
  }

  const result = await fetchGitHubReleasesResult(
    fetchImpl,
    undefined,
    token ? { token } : undefined
  );
  if (result.ok) {
    if (result.releases.length > 0) {
      lastGood = { releases: result.releases, storedAt: now };
      if (kv) {
        try {
          await kv.put(
            RELEASES_KV_KEY,
            JSON.stringify({ storedAt: now, releases: result.releases }),
            { expirationTtl: RELEASES_KV_TTL_SECONDS }
          );
        } catch (error: unknown) {
          console.error({ event: 'whats_new_releases_kv_put_failed', error: String(error) });
        }
      }
    }
    return { state: 'fresh', releases: result.releases };
  }

  const fallback = lastGood
    ? 'last_good'
    : kvEntry
      ? 'kv'
      : snapshot.length > 0
        ? 'snapshot'
        : 'none';
  console.error({
    event: 'whats_new_releases_unavailable',
    fallback,
    reason: result.reason,
    status: result.status,
  });
  if (lastGood) return { state: 'stale', releases: lastGood.releases };
  if (kvEntry) return { state: 'cached', releases: kvEntry.releases };
  if (snapshot.length > 0) return { state: 'snapshot', releases: snapshot };
  return { state: 'error', releases: [] };
}

/**
 * Show the neutral unavailable line only when GitHub failed and nothing at all can render
 * (no This week, no Last 30 days, no Latest updates). A genuine "nothing shipped" result
 * never shows it.
 */
export function shouldShowUpdatesUnavailable(
  loaded: WhatsNewReleases,
  glance: WhatsNewGlance
): boolean {
  if (loaded.state === 'fresh' || loaded.state === 'cached') return false;
  // Supersedes #1579: under stale/snapshot/KV, honesty is the visible <time>, not a banner.
  return !hasGlanceContent(glance);
}

/**
 * Releases loaded fine, but Matt's call (b) (#1163) hid every line as dev-shaped. Show the
 * NO_VISITOR_UPDATES_COPY line, never the can't-load line and never a blank page.
 */
export function shouldShowNoVisitorUpdates(
  loaded: WhatsNewReleases,
  glance: WhatsNewGlance
): boolean {
  if (loaded.state !== 'fresh' && loaded.state !== 'cached') return false;
  return loaded.releases.length > 0 && !hasGlanceContent(glance);
}
