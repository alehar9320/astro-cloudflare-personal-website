import { describe, expect, it } from 'vitest';

import {
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorRelease,
  toVisitorReleaseBody,
} from './visitor-changelog';

describe('visitor-changelog utilities', () => {
  describe('stripChangelogChrome', () => {
    it('handles empty and whitespace-only strings', () => {
      expect(stripChangelogChrome('')).toBe('');
      expect(stripChangelogChrome('   ')).toBe('');
    });

    it('strips commit SHA, conventional commit prefix, and PR suffix', () => {
      expect(stripChangelogChrome('a1b2c3d feat(ui): add new button (#123)')).toBe(
        'add new button'
      );
      expect(stripChangelogChrome('fix: resolve alignment issue (#456)')).toBe(
        'resolve alignment issue'
      );
      expect(stripChangelogChrome('chore(deps): update packages')).toBe('update packages');
    });

    it('collapses multiple whitespace characters', () => {
      expect(stripChangelogChrome('feat:   multiple   spaces  ')).toBe('multiple spaces');
    });

    it('stripChangelogChrome removes all trailing (#N) groups (#1163)', () => {
      expect(stripChangelogChrome('Raise home Read the case 44x44 hit-box clear of dock (#817) (#999)')).toBe(
        'Raise home Read the case 44x44 hit-box clear of dock'
      );
    });
  });

  describe('toVisitorChangelogTitle', () => {
    it('returns empty string for empty input', () => {
      expect(toVisitorChangelogTitle('')).toBe('');
      expect(toVisitorChangelogTitle('   ')).toBe('');
    });

    it('maps locked visitor changelog row PR_864 (#1163)', () => {
      expect(toVisitorChangelogTitle('Fix biography IFS Design System proof link hit target and mobile dock clearance (#864)')).toBe('Biography proof links are easier to tap, including on phones');
    });
    it('maps locked visitor changelog row PR_825 (#1163)', () => {
      expect(toVisitorChangelogTitle('Quiet Contact hire line to LinkedIn; no twin-mouth (#825)')).toBe('Contact sends hire interest to LinkedIn — one clear path');
    });
    it('maps locked visitor changelog row PR_823 (#1163)', () => {
      expect(toVisitorChangelogTitle('Cold-land Work/case so shared proof is a real site entry (#823)')).toBe('Shared Work links open the case as a real site entry');
    });
    it('maps locked visitor changelog row PR_819 (#1163)', () => {
      expect(toVisitorChangelogTitle('What’s New: denser desktop Last-30 so lines clear composer (#819)')).toBe('What’s New fits more updates above the chat dock on desktop');
    });
    it('maps locked visitor changelog row PR_817 raise (#1163)', () => {
      expect(toVisitorChangelogTitle('Raise home Read the case 44x44 hit-box clear of dock (#817)')).toBe('Home “Read the case” stays clear of the chat dock');
    });
    it('maps locked visitor changelog row PR_817 keep (#1163)', () => {
      expect(toVisitorChangelogTitle('Keep home Read the case clear of the docked composer (#817)')).toBe('Home “Read the case” stays clear of the chat dock');
    });
    it('maps locked visitor changelog row PR_803 (#1163)', () => {
      expect(toVisitorChangelogTitle('Hire tracking is live (#803)')).toBe('Hire interest tracking is live');
    });

    it('looks up known PR numbers', () => {
      expect(toVisitorChangelogTitle('feat: add a live RSS feed (#520)')).toBe(
        'RSS feed of the work'
      );
    });

    it('looks up known subjects when PR number is omitted', () => {
      expect(toVisitorChangelogTitle('add a live RSS feed for the work')).toBe(
        'RSS feed of the work'
      );
    });

    it('formats unknown commits by stripping chrome and capitalizing the first letter', () => {
      expect(
        toVisitorChangelogTitle('f1a2b3c feat(nav): improve keyboard accessibility (#999)')
      ).toBe('Improve keyboard accessibility');
    });

    it('returns already clean visitor titles as-is', () => {
      expect(toVisitorChangelogTitle('Clean visitor title without chrome')).toBe(
        'Clean visitor title without chrome'
      );
    });

    it('falls back gracefully when chrome stripping leaves an empty subject', () => {
      expect(toVisitorChangelogTitle('a1b2c3d feat:')).toBe('Feat:');
    });
  });

  describe('toVisitorReleaseBody', () => {
    it('returns empty string for empty body', () => {
      expect(toVisitorReleaseBody('')).toBe('');
      expect(toVisitorReleaseBody('   ')).toBe('');
    });

    it('converts bullet point lines into visitor titles', () => {
      const input =
        '- 520 feat: add a live RSS feed for the work (#520)\n* 518 feat: add a working web app manifest (#518)';
      const output = toVisitorReleaseBody(input);
      expect(output).toBe('- RSS feed of the work\n- Web app manifest');
    });

    it('handles CRLF line endings correctly', () => {
      const input =
        '- 520 feat: add a live RSS feed for the work (#520)\r\n* 518 feat: add a working web app manifest (#518)\r\n';
      const output = toVisitorReleaseBody(input);
      expect(output).toBe('- RSS feed of the work\n- Web app manifest');
    });

    it('filters out internal agent or tool items from bullet lists', () => {
      const input =
        '- feat: add public feature\n- chore(jules): internal sync\n- refactor(engine): internal logic';
      const output = toVisitorReleaseBody(input);
      expect(output).toBe('- Add public feature');
    });

    it('falls back to toVisitorChangelogTitle if body contains no bullet items', () => {
      const input = 'a1b2c3d feat: add a live RSS feed for the work (#520)';
      expect(toVisitorReleaseBody(input)).toBe('RSS feed of the work');
    });

    it('falls back to toVisitorChangelogTitle if all bullet items are filtered as internal', () => {
      const input = '- chore(jules): internal update\n- refactor(engine): backend tweak';
      expect(toVisitorReleaseBody(input)).toBe(
        '- chore(jules): internal update\n- refactor(engine): backend tweak'
      );
    });
  });

  describe('toVisitorRelease', () => {
    it('transforms the release body while preserving other release properties', () => {
      const release = {
        version: 'v1.0.0',
        publishedAt: '2026-05-01T12:00:00Z',
        url: 'https://example.com/release/v1.0.0',
        body: '- 520 feat: add a live RSS feed for the work (#520)',
      };

      const result = toVisitorRelease(release);
      expect(result).toEqual({
        version: 'v1.0.0',
        publishedAt: '2026-05-01T12:00:00Z',
        url: 'https://example.com/release/v1.0.0',
        body: '- RSS feed of the work',
      });
    });
  });
});