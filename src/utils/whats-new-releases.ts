import { z } from 'zod';
import {
  fetchGitHubReleasesResult,
  GitHubReleaseApiItemSchema,
  normalizeRelease,
  type SiteRelease,
} from './github-releases';
import type { WhatsNewGlance } from './whats-new-glance';

/**
 * Releases for /whats-new/ SSR (#1579 follow-up).
 *
 * A failed GitHub fetch (unauthenticated 60/h per egress IP, 403/429, 5xx, network,
 * timeout) used to look like an empty list. The page then fell back to a snapshot older
 * than 30 days, so This week and Last 30 days vanished on a large share of requests.
 * Here a failure is never an empty list:
 * - `fresh`: GitHub answered. A non-empty list becomes this isolate's last good list.
 * - `cached`: this isolate's last good list is younger than FRESH_MS; GitHub is not called.
 * - `stale`: GitHub failed; this isolate's last good list is served.
 * - `snapshot`: GitHub failed and the isolate has none; the build-time snapshot is served.
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
}

/** Eden PASS, word for word. Shown above the existing "Full history on GitHub" link. */
export const UPDATES_UNAVAILABLE_COPY =
  "Recent updates can't load right now. The full history is on GitHub.";

/** Reuse the last good list without calling GitHub for this long (eases the 60/h limit). */
export const FRESH_MS = 2 * 60 * 1000;

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
  const { fetchImpl = fetch, now = Date.now(), snapshot = BUILD_SNAPSHOT, token } = options;
  if (lastGood && now - lastGood.storedAt < FRESH_MS) {
    return { state: 'cached', releases: lastGood.releases };
  }

  const result = await fetchGitHubReleasesResult(
    fetchImpl,
    undefined,
    token ? { token } : undefined
  );
  if (result.ok) {
    if (result.releases.length > 0) lastGood = { releases: result.releases, storedAt: now };
    return { state: 'fresh', releases: result.releases };
  }

  const fallback = lastGood ? 'last_good' : snapshot.length > 0 ? 'snapshot' : 'none';
  console.error({
    event: 'whats_new_releases_unavailable',
    fallback,
    reason: result.reason,
    status: result.status,
  });
  if (lastGood) return { state: 'stale', releases: lastGood.releases };
  if (snapshot.length > 0) return { state: 'snapshot', releases: snapshot };
  return { state: 'error', releases: [] };
}

/**
 * Show the neutral unavailable line when both sections are empty and either GitHub failed, or
 * releases loaded but every line was hidden (Matt's call (b)). A genuinely empty list never shows it.
 */
export function shouldShowUpdatesUnavailable(
  loaded: WhatsNewReleases,
  glance: WhatsNewGlance
): boolean {
  if (glance.thisWeek.length > 0 || glance.groups.length > 0) return false;
  // GitHub failed and the fallback is empty, or releases loaded but every line was hidden as
  // dev-shaped (Matt's call (b), #1163): show the neutral line, never a blank page.
  if (loaded.state === 'fresh' || loaded.state === 'cached') return loaded.releases.length > 0;
  return true;
}
