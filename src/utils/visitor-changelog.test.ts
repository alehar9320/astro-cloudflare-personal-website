import { describe, it, expect } from 'vitest';
import {
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorReleaseBody,
  toVisitorRelease,
  VISITOR_CHANGELOG,
} from './visitor-changelog';

describe('visitor-changelog utility', () => {
  describe('stripChangelogChrome', () => {
    it('strips commit hash, conventional commit type, and PR suffix', () => {
      expect(stripChangelogChrome('a1b2c3d feat(ui): add new button (#524)')).toBe(
        'add new button'
      );
    });

    it('handles lines with only conventional commit prefix', () => {
      expect(stripChangelogChrome('fix: resolve alignment bug')).toBe('resolve alignment bug');
    });

    it('collapses extra spaces and trims whitespace', () => {
      expect(stripChangelogChrome('   chore:    clean   up   files   (#123)   ')).toBe(
        'clean up files'
      );
    });

    it('returns clean text unchanged if no chrome present', () => {
      expect(stripChangelogChrome('Clean title without chrome')).toBe('Clean title without chrome');
    });
  });

  describe('toVisitorChangelogTitle', () => {
    it('returns empty string for empty or whitespace-only input', () => {
      expect(toVisitorChangelogTitle('')).toBe('');
      expect(toVisitorChangelogTitle('   ')).toBe('');
    });

    it('maps known PR numbers from VISITOR_CHANGELOG', () => {
      expect(toVisitorChangelogTitle('feat: rewrite What’s New for visitors (#524)')).toBe(
        'What’s New rewritten for visitors'
      );
      expect(toVisitorChangelogTitle('feat: add a live RSS feed for the work (#520)')).toBe(
        'RSS feed of the work'
      );
    });

    it('maps known subjects when PR number is absent', () => {
      expect(toVisitorChangelogTitle('rewrite What’s New for visitors')).toBe(
        'What’s New rewritten for visitors'
      );
    });

    it('formats unmapped commits by stripping chrome and capitalizing the first letter', () => {
      expect(toVisitorChangelogTitle('feat(ui): update header navigation (#9999)')).toBe(
        'Update header navigation'
      );
    });

    it('returns unchanged if raw is already visitor copy without chrome', () => {
      const visitorTitle = 'What’s New rewritten for visitors';
      expect(toVisitorChangelogTitle(visitorTitle)).toBe(visitorTitle);
    });

    it('handles SHA prefix and chrome when subject becomes empty after stripping chrome', () => {
      expect(toVisitorChangelogTitle('a1b2c3d feat:')).toBe('Feat:');
    });
  });

  describe('toVisitorReleaseBody', () => {
    it('transforms bulleted release bodies and filters out internal items', () => {
      const rawBody = `
- feat: rewrite What’s New for visitors (#524)
* chore(jules): update prompt context
+ fix: resolve alignment bug (#9999)
- docs: update agent-farm details
      `;

      const result = toVisitorReleaseBody(rawBody);
      expect(result).toBe('- What’s New rewritten for visitors\n- Resolve alignment bug');
    });

    it('falls back to transforming single body text when no bullets exist', () => {
      expect(toVisitorReleaseBody('feat: rewrite What’s New for visitors (#524)')).toBe(
        'What’s New rewritten for visitors'
      );
    });

    it('returns empty string for empty body or body containing only internal items', () => {
      expect(toVisitorReleaseBody('')).toBe('');
      expect(toVisitorReleaseBody('- chore(jules): internal update')).toBe('');
    });
  });

  describe('toVisitorRelease', () => {
    it('preserves release fields while rewriting the body for visitors', () => {
      const inputRelease = {
        version: 'v1.2.3',
        publishedAt: '2026-04-01T12:00:00Z',
        title: 'Release v1.2.3',
        url: 'https://github.com/releases/v1.2.3',
        body: '- feat: rewrite /experimental/now/ for visitors (#523)',
      };

      const result = toVisitorRelease(inputRelease);

      expect(result).toEqual({
        ...inputRelease,
        body: '- Now page rewritten for visitors',
      });
    });
  });

  describe('VISITOR_CHANGELOG catalog', () => {
    it('contains valid mapped PR entries', () => {
      expect(VISITOR_CHANGELOG.length).toBeGreaterThan(0);
      for (const entry of VISITOR_CHANGELOG) {
        expect(typeof entry.pr).toBe('number');
        expect(typeof entry.subject).toBe('string');
        expect(typeof entry.title).toBe('string');
      }
    });
  });
});
