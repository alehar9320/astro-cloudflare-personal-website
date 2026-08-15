import type { SiteRelease } from '../utils/github-releases';

/** Last known GitHub release, used when the Worker cannot reach api.github.com. */
export const LATEST_RELEASE_SNAPSHOT: SiteRelease = {
  body: '- 66e3fe9 fix: open the visit glance on tap at 375 (#461)',
  publishedAt: '2026-08-15T17:20:18Z',
  title: '2026.08.15.1720',
  url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.15.1720',
  version: '2026.08.15.1720',
};
