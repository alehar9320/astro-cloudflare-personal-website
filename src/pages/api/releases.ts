import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { LATEST_RELEASE_SNAPSHOT } from '../../data/latest-release';
import {
  fetchGitHubReleases,
  SiteReleaseSchema,
  type SiteRelease,
} from '../../utils/github-releases';
import { toVisitorChangelogTitle, toVisitorRelease } from '../../utils/visitor-changelog';

const jsonHeaders = {
  'content-type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

export const prerender = false;
export const RELEASES_CACHE_KEY = 'github-releases:v1:latest';

export interface ReleasesEnv {
  CHAT_STORE?: KVNamespace;
  GITHUB_TOKEN?: string;
}

function readEnv(): ReleasesEnv {
  try {
    if (env && typeof env === 'object') return env as ReleasesEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

export const GET: APIRoute = async () => {
  try {
    const bindings = readEnv();
    const store = bindings.CHAT_STORE;

    if (store) {
      try {
        const cached = await store.get(RELEASES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const validation = SiteReleaseSchema.array().safeParse(parsed);
          if (validation.success && validation.data.length > 0) {
            return new Response(JSON.stringify(validation.data), { headers: jsonHeaders });
          }
        }
      } catch (cacheError: unknown) {
        console.error({ event: 'releases_cache_read_error', error: String(cacheError) });
      }
    }

    const fetchedReleases = await fetchGitHubReleases(
      fetch,
      undefined,
      bindings.GITHUB_TOKEN ? { token: bindings.GITHUB_TOKEN } : undefined
    );

    const baseReleases: SiteRelease[] =
      fetchedReleases.length > 0 ? fetchedReleases : [LATEST_RELEASE_SNAPSHOT];

    const releases = baseReleases.map((release) => {
      const visitor = toVisitorRelease(release);
      return {
        ...visitor,
        body: visitor.body
          .split('\n')
          .map((line) => {
            const bullet = line.match(/^([-*+]\s+)(.*)$/);
            if (!bullet) return toVisitorChangelogTitle(line);
            return `${bullet[1]}${toVisitorChangelogTitle(bullet[2])}`;
          })
          .join('\n'),
      };
    });

    if (store && releases.length > 0) {
      try {
        await store.put(RELEASES_CACHE_KEY, JSON.stringify(releases), { expirationTtl: 3600 });
      } catch (cacheError: unknown) {
        console.error({ event: 'releases_cache_write_error', error: String(cacheError) });
      }
    }

    return new Response(JSON.stringify(releases), { headers: jsonHeaders });
  } catch (error: unknown) {
    console.error({ event: 'releases_api_error', error: String(error) });
    const fallback = [toVisitorRelease(LATEST_RELEASE_SNAPSHOT)];
    return new Response(JSON.stringify(fallback), { headers: jsonHeaders });
  }
};
