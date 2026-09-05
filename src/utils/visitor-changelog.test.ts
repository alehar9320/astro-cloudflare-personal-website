import { describe, expect, it } from 'vitest';
import {
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorRelease,
  toVisitorReleaseBody,
} from './visitor-changelog';

describe('visitor-changelog utils', () => {
  describe('stripChangelogChrome', () => {
    it('strips commit hash prefixes', () => {
      expect(stripChangelogChrome('41fe7ae rewrite What’s New')).toBe('rewrite What’s New');
      expect(
        stripChangelogChrome('a1b2c3d4e5f6789012345678901234567890a1b2 rewrite What’s New')
      ).toBe('rewrite What’s New');
    });

    it('strips conventional commit prefixes', () => {
      expect(stripChangelogChrome('feat: add RSS feed')).toBe('add RSS feed');
      expect(stripChangelogChrome('fix(sitemap): drop 404 links')).toBe('drop 404 links');
      expect(stripChangelogChrome('chore: update dependencies')).toBe('update dependencies');
    });

    it('strips PR number suffix', () => {
      expect(stripChangelogChrome('add RSS feed (#520)')).toBe('add RSS feed');
    });

    it('strips combination of SHA, conventional commit prefix, and PR suffix', () => {
      expect(stripChangelogChrome('515bbf9 feat: add a live RSS feed for the work (#520)')).toBe(
        'add a live RSS feed for the work'
      );
    });

    it('collapses internal extra spaces', () => {
      expect(stripChangelogChrome('feat:   add   a   live   sitemap   ')).toBe(
        'add a live sitemap'
      );
    });
  });

  describe('toVisitorChangelogTitle', () => {
    it('maps known PR numbers to human visitor titles', () => {
      expect(toVisitorChangelogTitle('515bbf9 feat: add a live RSS feed for the work (#520)')).toBe(
        'RSS feed of the work'
      );
      expect(toVisitorChangelogTitle('41fe7ae feat: rewrite /experimental/now/ (#523)')).toBe(
        'Now page rewritten for visitors'
      );
    });

    it('maps known subjects when PR suffix is absent', () => {
      expect(toVisitorChangelogTitle('feat: add a live RSS feed for the work')).toBe(
        'RSS feed of the work'
      );
    });

    it('title-cases sanitized unknown commit messages', () => {
      expect(toVisitorChangelogTitle('feat: optimize edge rendering pipeline')).toBe(
        'Optimize edge rendering pipeline'
      );
    });

    it('returns empty string for empty input', () => {
      expect(toVisitorChangelogTitle('')).toBe('');
      expect(toVisitorChangelogTitle('   ')).toBe('');
    });
  });

  describe('toVisitorReleaseBody', () => {
    it('formats multi-line list release bodies into visitor titles', () => {
      const rawBody = `
- 515bbf9 feat: add a live RSS feed for the work (#520)
- 62dd4d6 fix: drop sitemap URLs that 404 (#521)
* 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)
`;
      const result = toVisitorReleaseBody(rawBody);
      expect(result).toBe(
        `- RSS feed of the work\n- Sitemap no longer lists pages that 404\n- Now page rewritten for visitors`
      );
    });

    it('filters out internal agent/changelog items', () => {
      const rawBody = `
- 515bbf9 feat: add a live RSS feed for the work (#520)
- e1f2g3h chore: jules refactored parser logic
- 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)
- a1b2c3d fix: agent-farm performance tweak
`;
      const result = toVisitorReleaseBody(rawBody);
      expect(result).toBe(`- RSS feed of the work\n- Now page rewritten for visitors`);
    });

    it('falls back to single visitor title for non-list release body', () => {
      expect(toVisitorReleaseBody('2026.08.16.2111')).toBe('2026.08.16.2111');
      expect(toVisitorReleaseBody('feat: add a live RSS feed for the work (#520)')).toBe(
        'RSS feed of the work'
      );
    });

    it('returns empty string for empty input', () => {
      expect(toVisitorReleaseBody('')).toBe('');
    });
  });

  describe('toVisitorRelease', () => {
    it('preserves release attributes while formatting body', () => {
      const release = {
        version: '2026.08.16.2111',
        title: 'Release 2026.08.16.2111',
        publishedAt: '2026-08-16T21:12:02Z',
        url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
        body: '- 515bbf9 feat: add a live RSS feed for the work (#520)',
        extraProp: 123,
      };

      const result = toVisitorRelease(release);
      expect(result).toEqual({
        version: '2026.08.16.2111',
        title: 'Release 2026.08.16.2111',
        publishedAt: '2026-08-16T21:12:02Z',
        url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
        body: '- RSS feed of the work',
        extraProp: 123,
      });
    });
  });
});
