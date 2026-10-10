import { describe, expect, it } from 'vitest';

import {
  INTERNAL_CHANGELOG_ITEM,
  stripChangelogChrome,
  toVisitorChangelogTitle,
  toVisitorRelease,
  toVisitorReleaseBody,
  VISITOR_CHANGELOG,
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

    it('stripChangelogChrome removes all trailing (#N) groups (#1163)', () => {
      expect(
        stripChangelogChrome('Raise home Read the case 44x44 hit-box clear of dock (#817) (#999)')
      ).toBe('Raise home Read the case 44x44 hit-box clear of dock');
    });
  });

  describe('toVisitorChangelogTitle', () => {
    it('returns empty string for empty input', () => {
      expect(toVisitorChangelogTitle('')).toBe('');
      expect(toVisitorChangelogTitle('   ')).toBe('');
    });

    it('maps locked visitor changelog row PR_864 (#1163)', () => {
      expect(
        toVisitorChangelogTitle(
          'Fix biography IFS Design System proof link hit target and mobile dock clearance (#864)'
        )
      ).toBe('The IFS Design System link on Biography is easier to tap, including on phones');
    });
    it('maps locked visitor changelog row PR_825 (#1163)', () => {
      expect(
        toVisitorChangelogTitle('Quiet Contact hire line to LinkedIn; no twin-mouth (#825)')
      ).toBe('Contact names one hire path: LinkedIn');
    });
    it('maps locked visitor changelog row PR_823 (#1163)', () => {
      expect(
        toVisitorChangelogTitle('Cold-land Work/case so shared proof is a real site entry (#823)')
      ).toBe('Case pages opened from a shared link now show a way back to Work on phones');
    });
    it('maps locked visitor changelog row PR_819 (#1163)', () => {
      expect(
        toVisitorChangelogTitle('What’s New: denser desktop Last-30 so lines clear composer (#819)')
      ).toBe('What’s New fits more updates above the chat dock on desktop');
    });
    it('maps locked visitor changelog row PR_817 raise (#1163)', () => {
      expect(
        toVisitorChangelogTitle('Raise home Read the case 44x44 hit-box clear of dock (#817)')
      ).toBe('Home “Read the case” stays clear of the chat dock');
    });
    it('maps locked visitor changelog row PR_815 keep (#1163)', () => {
      expect(
        toVisitorChangelogTitle('Keep home Read the case clear of the docked composer (#815)')
      ).toBe('Home “Read the case” stays clear of the chat dock');
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
      '- Shared links to Home, Biography, Work and Contact, and the RSS feed, now describe the page itself',
      '- The AI coding copilots case ends with a single LinkedIn link',
      '- Work ends with a single LinkedIn link',
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

describe('visitor titles for Last 30 days release lines (#1163 extension)', () => {
  it('maps #1019 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle('ed3b478 fix(chat): quiet open welcome h2 to AI twin (#1016) (#1019)')
    ).toBe('Open chat shows a quieter “AI twin” heading');
  });
  it('maps #1107 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'b38f2fb fix(biography): drop in-body LinkedIn; keep chrome ContactCTA (#1103) (#1107)'
      )
    ).toBe('Biography ends with a single LinkedIn link');
  });
  it('maps #1116 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle('536b0f9 Analytics: Get in touch from chrome only (#1111) (#1116)')
    ).toBe('The user behavior analytics case ends with a single LinkedIn link');
  });
  it('maps #1110 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle('cc41498 Copilots: Get in touch from chrome only (#1105) (#1110)')
    ).toBe('The AI coding copilots case ends with a single LinkedIn link');
  });
  it('maps #1109 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        '86f0f90 fix(work): drop in-body hire-cta; keep chrome ContactCTA (#1104) (#1109)'
      )
    ).toBe('Work ends with a single LinkedIn link');
  });
  it('maps #1642 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'ce35c50 fix(hire): drop thesis in-body Get in touch; add 404 to HireSurface (#1642)'
      )
    ).toBe('The master thesis case ends with a single LinkedIn link');
  });
  it('maps #983 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        '9c4bb83 Visitors on the IFS Design System case take Get in touch from chrome, not a second primary under the H1 (#983)'
      )
    ).toBe('The IFS Design System case ends with a single LinkedIn link');
  });
  it('maps #1034 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'c5ee1ec fix(biography): link copilots mention to the case (#1028) (#1034)'
      )
    ).toBe('Biography links the AI coding copilots mention to its case');
  });
  it('maps #1035 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        '9818672 fix(biography): link M.Sc. row to master-thesis case (#1030) (#1035)'
      )
    ).toBe('Biography links the M.Sc. entry to the master thesis case');
  });
  it('maps #1635 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle('40e4a52 fix(copy): align leftover hire hint to LinkedIn (#1635)')
    ).toBe('The 404 page hint now just says LinkedIn');
  });
  it('maps #1634 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'f2b6c8d fix(chat): start desktop open stage below the header nav (#1633) (#1634)'
      )
    ).toBe('With chat open on a laptop, the header nav links stay clickable');
  });
  it('maps #939 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'd7c1c20 Give laptop open chat a conversation stage under the header (#939)'
      )
    ).toBe('On a laptop, open chat sits under the header instead of covering the whole page');
  });
  it('maps #1643 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        '48c550e docs(work): case meta descriptions describe the case, not the hire CTA (#1643)'
      )
    ).toBe('Shared Work case links now preview what each case is about');
  });
  it('maps #1644 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        'c1621b4 docs(meta): page and feed descriptions describe the page, not the hire CTA (#1644)'
      )
    ).toBe(
      'Shared links to Home, Biography, Work and Contact, and the RSS feed, now describe the page itself'
    );
  });
  describe('internal analytics lines never reach visitors (#1577, #803; Johan 6097557179)', () => {
    const rawSubjects = [
      '- e651ca6 feat: expose window.posthog after idle init for hire events (#1574) (#1577)',
      '- expose window.posthog after idle init for hire events (#1577)',
      '- abc1234 fix(okr): hire tracking is live (#803)',
      '- Hire tracking is live (#803)',
    ];
    const formerTitles = [
      'Taps on the hire links are now counted',
      'Site success page shows hire tracking as live',
      'Hire interest tracking is live',
    ];

    it('has no visitor title row for #1577 or #803', () => {
      expect(VISITOR_CHANGELOG.some((entry) => entry.pr === 1577 || entry.pr === 803)).toBe(false);
    });

    it.each(rawSubjects)('drops raw subject %s from the visitor body', (line) => {
      expect(INTERNAL_CHANGELOG_ITEM.test(line)).toBe(true);
      expect(toVisitorReleaseBody(line)).toBe('');
      expect(formerTitles).not.toContain(toVisitorChangelogTitle(line.replace(/^- /, '')));
    });

    it('keeps both off This week and Last 30 days', () => {
      const glance = buildWhatsNewGlance(
        [
          {
            body: rawSubjects.join('\n'),
            publishedAt: '2026-10-10T10:00:00Z',
            title: 'r',
            url: 'u',
            version: '2026.10.10.1000',
          },
        ],
        new Date('2026-10-10T12:00:00Z')
      );
      expect(glance.thisWeek).toEqual([]);
      expect(glance.groups).toEqual([]);
    });

    it('does not drop visitor hire lines that mention LinkedIn or hire links', () => {
      for (const title of [
        'Biography ends with a single LinkedIn link',
        'Contact names one hire path: LinkedIn',
        'The 404 page hint now just says LinkedIn',
      ]) {
        expect(INTERNAL_CHANGELOG_ITEM.test(title), title).toBe(false);
      }
    });
  });
  it('maps #1167 to a visitor title via the last (#N)', () => {
    expect(
      toVisitorChangelogTitle(
        '80c22f7 What’s New: hiring visitors read outcome lines, not eng shorthand (#1167)'
      )
    ).toBe('What’s New now describes each update in plain language');
    // Resolves by PR number, not subject: an issue ref before it must not win.
    expect(toVisitorChangelogTitle('Some other squash subject (#1163) (#1167)')).toBe(
      'What’s New now describes each update in plain language'
    );
  });
  it('maps #945 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        "efba2fa fix(this-site): in-sentence What's New link to /whats-new/ (#837) (#945)"
      )
    ).toBe('The “This site” page now links to What’s New');
  });
  it('maps #1020 to a visitor title', () => {
    expect(
      toVisitorChangelogTitle(
        '8b68dea Hiring managers on the copilots case get a continue to IFS Design System proof, not a circular stub (#1020)'
      )
    ).toBe('The AI coding copilots case now ends with a link to the IFS Design System case');
  });
  it('maps the real #815 and #817 squash subjects to the same home title', () => {
    for (const line of [
      'b4305fd Keep home Read the case clear of the docked composer (#812) (#815)',
      'c884599 Raise home Read the case 44x44 hit-box clear of dock (#812) (#817)',
    ]) {
      expect(toVisitorChangelogTitle(line)).toBe(
        'Home “Read the case” stays clear of the chat dock'
      );
    }
  });
  it('looks up the LAST (#N) in a squash title, not the issue ref before it', () => {
    // #817 is mapped; #99999 is not. The squash PR is the last suffix.
    expect(toVisitorChangelogTitle('Some internal change (#817) (#99999)')).toBe(
      'Some internal change'
    );
    expect(toVisitorChangelogTitle('Some internal change (#99999) (#817)')).toBe(
      'Home “Read the case” stays clear of the chat dock'
    );
  });
});
