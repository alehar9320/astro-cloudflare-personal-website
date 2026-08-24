import { describe, expect, it } from 'vitest';
import {
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorReleaseBody,
  toVisitorRelease,
} from './visitor-changelog';

describe('visitor-changelog utility', () => {
  describe('stripChangelogChrome', () => {
    it('strips SHA, conventional commit type, scope, breaking marker, and PR suffix', () => {
      expect(stripChangelogChrome('a1b2c3d feat(api): add new endpoint (#123)')).toBe(
        'add new endpoint'
      );
    });

    it('handles breaking change indicators with !:', () => {
      expect(stripChangelogChrome('feat!: breaking change')).toBe('breaking change');
      expect(stripChangelogChrome('fix(core)!: critical patch (#500)')).toBe('critical patch');
    });

    it('handles markdown formatted conventional prefixes', () => {
      expect(stripChangelogChrome('**feat:** add feature')).toBe('add feature');
      expect(stripChangelogChrome('**fix(ui)!:** resolve layout glitch')).toBe(
        'resolve layout glitch'
      );
    });

    it('leaves clean text unaffected', () => {
      expect(stripChangelogChrome('Clean sentence without chrome')).toBe(
        'Clean sentence without chrome'
      );
    });
  });

  describe('toVisitorChangelogTitle', () => {
    it('maps known shipped PR numbers to visitor titles', () => {
      expect(toVisitorChangelogTitle('feat: rewrite What’s New for visitors (#524)')).toBe(
        'What’s New rewritten for visitors'
      );
      expect(toVisitorChangelogTitle('fix: offer LinkedIn hire on the not-found page (#519)')).toBe(
        'Get in touch on LinkedIn from the not-found page'
      );
    });

    it('maps known subjects when PR suffix is missing', () => {
      expect(toVisitorChangelogTitle('rewrite /experimental/now/ for visitors')).toBe(
        'Now page rewritten for visitors'
      );
    });

    it('capitalizes and cleans unmapped conventional commit messages', () => {
      expect(toVisitorChangelogTitle('feat: improve network response time')).toBe(
        'Improve network response time'
      );
      expect(toVisitorChangelogTitle('fix(auth)!: enforce strict token verification')).toBe(
        'Enforce strict token verification'
      );
    });

    it('is idempotent for already-visitor copy', () => {
      const visitorTitle = 'What’s New rewritten for visitors';
      expect(toVisitorChangelogTitle(visitorTitle)).toBe(visitorTitle);
    });

    it('returns empty string when given whitespace', () => {
      expect(toVisitorChangelogTitle('   ')).toBe('');
    });
  });

  describe('toVisitorReleaseBody', () => {
    it('converts markdown bullets to visitor titles and filters internal agents', () => {
      const input = [
        '- 8302a2a feat: offer LinkedIn hire on the not-found page (#519)',
        '- 9ef3e5b fix: internal jules workflow update',
        '* feat: improve network response time',
        '+ fix: resolve agent-farm synchronization',
      ].join('\n');

      const result = toVisitorReleaseBody(input);
      expect(result).toBe(
        '- Get in touch on LinkedIn from the not-found page\n- Improve network response time'
      );
    });

    it('falls back to single title conversion when no bullets exist', () => {
      expect(toVisitorReleaseBody('feat: rewrite What’s New for visitors (#524)')).toBe(
        'What’s New rewritten for visitors'
      );
    });

    it('returns empty string for empty body', () => {
      expect(toVisitorReleaseBody('')).toBe('');
    });
  });

  describe('toVisitorRelease', () => {
    it('transforms release body while preserving other release metadata', () => {
      const release = {
        version: '2026.01.01.1000',
        url: 'https://github.com/example/releases/tag/v1',
        publishedAt: '2026-01-01T10:00:00Z',
        body: '- feat: rewrite What’s New for visitors (#524)',
      };

      const transformed = toVisitorRelease(release);
      expect(transformed).toEqual({
        version: '2026.01.01.1000',
        url: 'https://github.com/example/releases/tag/v1',
        publishedAt: '2026-01-01T10:00:00Z',
        body: '- What’s New rewritten for visitors',
      });
    });
  });
});
