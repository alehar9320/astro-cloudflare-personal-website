import { describe, expect, it } from 'vitest';

import { LATEST_RELEASE_SNAPSHOT } from '../data/latest-release';
import type { SiteRelease } from '../utils/github-releases';
import { toVisitorChangelogTitle } from '../utils/visitor-changelog';
import { buildWhatsNewGlance, isKeptVisitorLine } from '../utils/whats-new-glance';

const now = new Date('2026-08-20T18:00:00Z');

function release(
  partial: Partial<SiteRelease> & { body: string; publishedAt: string }
): SiteRelease {
  return {
    title: partial.title ?? '2026.08.20.0000',
    url: partial.url ?? 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases',
    version: partial.version ?? '2026.08.20.0000',
    ...partial,
  };
}

function kept(raw: string): boolean {
  return isKeptVisitorLine(raw, toVisitorChangelogTitle(raw));
}

describe('whats-new glance', () => {
  it('drops JSON-LD, GITHUB_TOKEN, empty notes, and twin-context-only lines', () => {
    expect(kept('feat: add Product Manager to the analytics JSON-LD WebPage name (#604)')).toBe(
      false
    );
    expect(kept('feat: read Worker GITHUB_TOKEN on /api/releases (#627)')).toBe(false);
    expect(isKeptVisitorLine('No documented changes.', 'No documented changes.')).toBe(false);
    expect(kept('fix: four typos in author LinkedIn context (#631)')).toBe(false);
  });

  it('keeps visitor-facing chat, What’s New, and work-case notes', () => {
    expect(kept('feat: dock chat composer to the bottom edge and use the stage (#618)')).toBe(true);
    expect(kept('fix: paint What’s New latest banner from the first card (#629)')).toBe(true);
    expect(kept('open the visit glance on tap at 375 (#461)')).toBe(true);
  });

  it('builds a This week strip and ≤4 theme groups from real notes', () => {
    const glance = buildWhatsNewGlance(
      [
        release({
          body: '- 9ef3e5b fix: paint What’s New latest banner from the first card (#629)',
          publishedAt: '2026-08-20T08:34:54Z',
        }),
        release({
          body: '- 91fcbf6 feat: read Worker GITHUB_TOKEN on /api/releases (#627)',
          publishedAt: '2026-08-20T06:49:19Z',
        }),
        release({
          body: '- No documented changes.',
          publishedAt: '2026-08-19T22:33:46Z',
        }),
        release({
          body: '- 3a39e72 feat: dock chat composer to the bottom edge and use the stage (#618)',
          publishedAt: '2026-08-19T22:32:23Z',
        }),
        release({
          body: '- a856286 fix: drop redundant Outcome sentence on user behavior analytics (#610)',
          publishedAt: '2026-08-19T18:42:32Z',
        }),
        release({
          body: '- 9bcc5bf feat: add Product Manager, Developer Experience at IFS to the user behavior analytics JSON-LD WebPage name (#604)',
          publishedAt: '2026-08-18T21:15:25Z',
        }),
        release({
          body: '- 8302a2a feat: offer LinkedIn hire on the not-found page (#519)',
          publishedAt: '2026-08-16T12:00:00Z',
        }),
      ],
      now
    );

    expect(glance.thisWeek).toHaveLength(3);
    expect(glance.thisWeek.join('\n')).not.toMatch(/2026\.|GITHUB_TOKEN|JSON-LD|No documented/i);
    expect(glance.thisWeek[0]).toContain('What’s New');
    expect(glance.groups.length).toBeGreaterThan(0);
    expect(glance.groups.length).toBeLessThanOrEqual(4);
    for (const group of glance.groups) {
      expect(group.lines.length).toBeGreaterThan(0);
      expect(group.lines.length).toBeLessThanOrEqual(2);
    }
    expect(glance.groups.map((group) => group.heading)).toContain("What's New");
    expect(glance.groups.map((group) => group.heading)).toContain('Chat and layout');
    expect(glance.groups.map((group) => group.heading)).toContain('Work-case copy');
    expect(glance.groups.map((group) => group.heading)).toContain('Hire and LinkedIn');
  });

  it('omits This week when nothing visitor-facing shipped in 7 days', () => {
    const glance = buildWhatsNewGlance(
      [
        release({
          body: '- 3a39e72 feat: dock chat composer to the bottom edge and use the stage (#618)',
          publishedAt: '2026-08-01T22:32:23Z',
        }),
      ],
      now
    );
    expect(glance.thisWeek).toEqual([]);
    expect(glance.groups).toHaveLength(1);
    expect(glance.groups[0].heading).toBe('Chat and layout');
  });

  it('still runs 7/30-day filters on LATEST_RELEASE_SNAPSHOT', () => {
    const glance = buildWhatsNewGlance([LATEST_RELEASE_SNAPSHOT], now);
    expect(glance.thisWeek.length).toBeGreaterThan(0);
    expect(glance.thisWeek.join('\n')).not.toMatch(/2026\.08\.15\.1720|66e3fe9|feat:|fix:/);
    expect(glance.thisWeek[0]).toMatch(/glance/i);
    expect(glance.groups.length).toBeGreaterThan(0);
  });

  it('omits snapshot ships older than 30 days', () => {
    const glance = buildWhatsNewGlance([LATEST_RELEASE_SNAPSHOT], new Date('2026-09-20T18:00:00Z'));
    expect(glance.thisWeek).toEqual([]);
    expect(glance.groups).toEqual([]);
  });
});
