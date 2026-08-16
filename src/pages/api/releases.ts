import type { APIRoute } from 'astro';
import { fetchGitHubReleases } from '../../utils/github-releases';
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

export const GET: APIRoute = async () => {
  try {
    const releases = (await fetchGitHubReleases()).map((release) => {
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
    return new Response(JSON.stringify(releases), { headers: jsonHeaders });
  } catch (error: unknown) {
    console.error({ event: 'releases_api_error', error: String(error) });
    return new Response(JSON.stringify([]), { headers: jsonHeaders });
  }
};
