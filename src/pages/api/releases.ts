import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import type { SiteRelease } from '../../utils/github-releases';
import { toVisitorRelease } from '../../utils/visitor-changelog';
import { loadWhatsNewReleases } from '../../utils/whats-new-releases';

// toVisitorRelease formats each release using toVisitorChangelogTitle

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
  CHAT_STORE?: KVNamespace;
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
  return releases.map(toVisitorRelease);
}

export const GET: APIRoute = async () => {
  try {
    const bindings = readEnv();
    const token = bindings.GITHUB_TOKEN?.trim();
    const kv = bindings.CHAT_STORE;
    // Same loader as /whats-new/ (#1776): isolate memory, CHAT_STORE KV, GitHub, build
    // snapshot. Nothing to serve is [], never the hardcoded Aug 15 stub.
    const loaded = await loadWhatsNewReleases({ token, kv });
    return new Response(JSON.stringify(visitorReleases(loaded.releases)), { headers: jsonHeaders });
  } catch (error: unknown) {
    console.error({ event: 'releases_api_error', error: String(error) });
    return new Response(JSON.stringify([]), { headers: jsonHeaders });
  }
};
