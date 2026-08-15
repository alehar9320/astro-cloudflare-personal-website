import type { APIRoute } from 'astro';
import { fetchGitHubReleases } from '../../utils/github-releases';

const jsonHeaders = {
  'content-type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const releases = await fetchGitHubReleases();
    return new Response(JSON.stringify(releases), { headers: jsonHeaders });
  } catch (error: unknown) {
    console.error({ event: 'releases_api_error', error: String(error) });
    return new Response(JSON.stringify([]), { headers: jsonHeaders });
  }
};
