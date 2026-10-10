import { describe, expect, it } from 'vitest';

import {
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorRelease,
  toVisitorReleaseBody,
} from './visitor-changelog';
import { buildWhatsNewGlance } from './whats-new-glance';

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
  });

  describe('toVisitorChangelogTitle', () => {
    it('returns empty string for empty input', () => {
      expect(toVisitorChangelogTitle('')).toBe('');
      expect(toVisitorChangelogTitle('   ')).toBe('');
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

    it('filters out Palette bot titles and unit test coverage items', () => {
      const paletteStr =
        '🎨 Palette: Standardize Chat Overlay Control Touch Targets and Focus States';
      const testCoverageStr = 'Expand unit test coverage for visitor-changelog utilities';
      const input = `- ${paletteStr}\n- ${testCoverageStr}\n- feat: add public feature`;
      const output = toVisitorReleaseBody(input);
      expect(output).toBe('- Add public feature');
      expect(output).not.toContain('Palette');
      expect(output).not.toContain('visitor-changelog utilities');
    });

    it('falls back to toVisitorChangelogTitle if body contains no bullet items', () => {
      const input = 'a1b2c3d feat: add a live RSS feed for the work (#520)';
      expect(toVisitorReleaseBody(input)).toBe('RSS feed of the work');
    });

    it('returns empty string if all bullet items are filtered as internal', () => {
      const input = '- chore(jules): internal update\n- refactor(engine): backend tweak';
      expect(toVisitorReleaseBody(input)).toBe('');
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

describe('visitor changelog drops dev-only release lines (spec C)', () => {
  const body = [
    '- c1621b4 docs(meta): page and feed descriptions describe the page, not the hire CTA (#1644)',
    '- 193eb14 docs(context): tighten LinkedIn scrape redaction (#1639 follow-up) (#1641)',
    '- 966de12 docs(context): strip logged-in LinkedIn UI from author-linkedin.md (#1639)',
    '- 90b95cd docs: README matches the live chat-first site (#880)',
    '- 8a114f6 fix(hire): /work/ #1109 nits: ContactCTA lock, trim padding, tag ifs-design-system CTA (#1638)',
    '- 7c9b03b fix(chat): recompute open stage top on scroll (#1633 follow-up) (#1636)',
    '- cc41498 Copilots: Get in touch from chrome only (#1105) (#1110)',
    '- 86f0f90 fix(work): drop in-body hire-cta; keep chrome ContactCTA (#1104) (#1109)',
  ].join('\n');

  it('drops #NNN refs, scrape wording and docs/context-only lines from the visitor body', () => {
    expect(toVisitorReleaseBody(body).split('\n')).toEqual([
      '- Page and feed descriptions describe the page, not the hire CTA',
      '- Copilots: Get in touch from chrome only',
      '- Drop in-body hire-cta; keep chrome ContactCTA',
    ]);
  });

  it('keeps What’s New This week and Last 30 days free of #NNN, scrape and README lines', () => {
    const now = new Date('2026-10-09T12:20:00Z');
    const releases = [
      {
        body,
        publishedAt: '2026-10-01T09:00:00Z',
        title: 'r1',
        url: 'u',
        version: '2026.10.01.0900',
      },
      {
        body: '- abc1234 fix(chat): give laptop open chat a conversation stage under the header (#939)',
        publishedAt: '2026-10-09T09:00:00Z',
        title: 'r2',
        url: 'u',
        version: '2026.10.09.0900',
      },
    ];
    const glance = buildWhatsNewGlance(releases.map(toVisitorRelease), now);
    const shown = [...glance.thisWeek, ...glance.groups.flatMap((g) => g.lines)];
    expect(shown.length).toBeGreaterThan(0);
    for (const line of shown) {
      expect(line).not.toMatch(/#\d+/);
      expect(line).not.toMatch(/\bscrape\b|\bredaction\b/i);
      expect(line).not.toMatch(/\bREADME\b|author-linkedin\.md/);
    }
  });
});
