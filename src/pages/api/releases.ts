import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { LATEST_RELEASE_SNAPSHOT } from '../../data/latest-release';
import { fetchGitHubReleases, type SiteRelease } from '../../utils/github-releases';
import { toVisitorChangelogTitle, toVisitorRelease } from '../../utils/visitor-changelog';

export { toVisitorChangelogTitle };

const jsonHeaders = {
  'content-type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

export const prerender = false;

export interface ReleasesEnv {
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

function visitorReleases(releases: SiteRelease[]) {
  return releases.map((release) => toVisitorRelease(release));
}

export const GET: APIRoute = async () => {
  try {
    const bindings = readEnv();
    const token = bindings.GITHUB_TOKEN?.trim();
    const fetched = await fetchGitHubReleases(fetch, undefined, token ? { token } : undefined);
    const baseReleases = fetched.length > 0 ? fetched : [LATEST_RELEASE_SNAPSHOT];
    return new Response(JSON.stringify(visitorReleases(baseReleases)), { headers: jsonHeaders });
  } catch (error: unknown) {
    console.error({ event: 'releases_api_error', error: String(error) });
    return new Response(JSON.stringify(visitorReleases([LATEST_RELEASE_SNAPSHOT])), {
      headers: jsonHeaders,
    });
  }
};
