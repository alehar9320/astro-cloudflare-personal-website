import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import type { SiteRelease } from '../utils/github-releases';
import {
  isDevShapedLine,
  isDevShapedUnmappedLine,
  mappedVisitorTitle,
  toVisitorRelease,
  toVisitorReleaseBody,
} from '../utils/visitor-changelog';
import { buildWhatsNewGlance } from '../utils/whats-new-glance';
import {
  NO_VISITOR_UPDATES_COPY,
  shouldShowNoVisitorUpdates,
  shouldShowUpdatesUnavailable,
  UPDATES_UNAVAILABLE_COPY,
} from '../utils/whats-new-releases';

// Matt's call (b), #1163: an UNMAPPED release line renders only if it passes the visitor-surface
// allowlist AND has no conventional / "Area:" prefix AND has no code token. Mapped rows always render.

const NOW = new Date('2026-10-10T13:30:00Z');
const rel = (body: string, publishedAt = '2026-10-10T13:18:00Z'): SiteRelease => ({
  body,
  publishedAt,
  title: '2026.10.10.1318',
  url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.10.10.1318',
  version: '2026.10.10.1318',
});
const painted = (releases: SiteRelease[]) => {
  const glance = buildWhatsNewGlance(releases.map(toVisitorRelease), NOW);
  return { glance, lines: [...glance.thisWeek, ...glance.groups.flatMap((g) => g.lines)] };
};

const RAW_1167 =
  '80c22f7 What’s New: hiring visitors read outcome lines, not eng shorthand (#1167)';

describe("unmapped dev-shaped squash lines are hidden (Matt's call (b))", () => {
  it('#1167 raw subject would be hidden if its row were absent, and renders mapped today', () => {
    // isDevShapedLine ignores VISITOR_CHANGELOG, i.e. the #1167 row is treated as absent.
    expect(isDevShapedLine(RAW_1167)).toBe(true);
    expect(isDevShapedUnmappedLine(RAW_1167)).toBe(false);
    expect(mappedVisitorTitle(RAW_1167)).toBe(
      'What’s New now describes each update in plain language'
    );
    const { lines } = painted([rel(`- ${RAW_1167}`)]);
    expect(lines).toEqual(['What’s New now describes each update in plain language']);
    expect(lines.join('\n')).not.toMatch(/eng shorthand|outcome lines/);
  });

  it('hides the same shape of line when it is genuinely unmapped', () => {
    const unmapped = 'abc1234 What’s New: visitors read tidier lines, not eng shorthand (#99991)';
    expect(isDevShapedUnmappedLine(unmapped)).toBe(true);
    expect(toVisitorReleaseBody(`- ${unmapped}`)).toBe('');
    expect(painted([rel(`- ${unmapped}`)]).lines).toEqual([]);
  });

  it.each([
    [
      'conventional prefix',
      'abc1234 fix(chat): give the chat composer a clearer focus ring (#99992)',
    ],
    ['Area: prefix', 'abc1234 Analytics: tidy the hire case wording (#99993)'],
    ['inline #NNN', 'abc1234 Home chat dock follow-up for #1609 on phones (#99994)'],
    ['file path', 'abc1234 Home card copy moves to src/pages/index.astro (#99995)'],
    ['backticks', 'abc1234 Home chat uses `aria-live` for replies (#99996)'],
    ['dev word', 'abc1234 Home chat context lint pass (#99997)'],
  ])('hides an unmapped line with a %s', (_why, raw) => {
    expect(isDevShapedUnmappedLine(raw)).toBe(true);
    expect(painted([rel(`- ${raw}`)]).lines).toEqual([]);
  });

  it('still renders genuine visitor-shaped unmapped lines', () => {
    const visitorLines = [
      '32e1809 Screen-reader visitors know which panel Menu opens (#978)',
      'abc1234 Visitors reach the case from the home card (#99998)',
    ];
    for (const raw of visitorLines) expect(isDevShapedUnmappedLine(raw)).toBe(false);
    const { lines } = painted([rel(visitorLines.map((l) => `- ${l}`).join('\n'))]);
    expect(lines).toEqual([
      'Screen-reader visitors know which panel Menu opens',
      'Visitors reach the case from the home card',
    ]);
  });

  it("all-filtered: shows the no-updates line, not the can't-load line", () => {
    const releases = [
      rel('- abc1234 fix(chat): give the chat composer a clearer focus ring (#99992)'),
    ];
    const glance = buildWhatsNewGlance(releases.map(toVisitorRelease), NOW);
    expect(glance).toEqual({ groups: [], thisWeek: [] });
    for (const state of ['fresh', 'cached'] as const) {
      expect(shouldShowNoVisitorUpdates({ state, releases }, glance)).toBe(true);
      expect(shouldShowUpdatesUnavailable({ state, releases }, glance)).toBe(false);
    }
    expect(NO_VISITOR_UPDATES_COPY).toBe('No new updates lately. The full history is on GitHub.');
    // A genuinely empty list is still neither (#1666).
    expect(shouldShowNoVisitorUpdates({ state: 'fresh', releases: [] }, glance)).toBe(false);
    expect(shouldShowUpdatesUnavailable({ state: 'fresh', releases: [] }, glance)).toBe(false);
  });

  it("fetch failure: shows the can't-load line, not the no-updates line", () => {
    const empty = { groups: [], thisWeek: [] };
    for (const state of ['error', 'stale', 'snapshot'] as const) {
      expect(shouldShowUpdatesUnavailable({ state, releases: [] }, empty)).toBe(true);
      expect(shouldShowNoVisitorUpdates({ state, releases: [] }, empty)).toBe(false);
    }
    expect(UPDATES_UNAVAILABLE_COPY).toBe(
      "Recent updates can't load right now. The full history is on GitHub."
    );
  });

  it('renders each empty-state line as role="status" right above the GitHub history link', () => {
    const page = readFileSync('src/pages/whats-new.astro', 'utf8');
    expect(page).toContain('shouldShowNoVisitorUpdates(loaded, glance)');
    expect(page).toMatch(
      /noVisitorUpdates && \(\s*<p class="updates-unavailable" role="status">\s*\{NO_VISITOR_UPDATES_COPY\}\s*<\/p>/
    );
    expect(page).toMatch(
      /<p class="updates-unavailable" role="status">\s*\{UPDATES_UNAVAILABLE_COPY\}\s*<\/p>\s*\)\s*\}\s*<p class="history">/
    );
    expect(page.indexOf('{NO_VISITOR_UPDATES_COPY}')).toBeLessThan(
      page.indexOf('<p class="history">')
    );
  });

  it('lets an explicit visitor prefix like "New case:" through the Area: rule', () => {
    const raw = 'abc1234 New case: IFS Design System (#99961)';
    expect(isDevShapedUnmappedLine(raw)).toBe(false);
    expect(painted([rel(`- ${raw}`)]).lines).toEqual(['New case: IFS Design System']);
    expect(isDevShapedUnmappedLine('abc1234 Analytics: tidy the hire case wording (#99993)')).toBe(
      true
    );
  });

  it.each(['Home', 'Biography', 'Work', 'Contact', 'This site'])(
    'lets the page-name prefix "%s:" through the Area: rule',
    (page) => {
      const raw = `abc1234 ${page}: the chat intro reads shorter (#99960)`;
      expect(isDevShapedUnmappedLine(raw)).toBe(false);
      expect(painted([rel(`- ${raw}`)]).lines).toEqual([`${page}: the chat intro reads shorter`]);
    }
  );

  it('page-name prefix only bypasses the Area: rule, not the visitor-surface allowlist', () => {
    // "This site" is not itself a VISIBLE_SURFACE word, so the line still needs one.
    expect(painted([rel('- abc1234 This site: the intro reads shorter (#99956)')]).lines).toEqual(
      []
    );
  });

  it('never lets "What’s New:" through as a page-name prefix', () => {
    expect(isDevShapedUnmappedLine('abc1234 What’s New: tidier lines (#99959)')).toBe(true);
    expect(isDevShapedUnmappedLine("abc1234 What's New: tidier lines (#99958)")).toBe(true);
  });

  it('matches CI only as an uppercase word and no longer treats env/api/eng as dev words', () => {
    expect(isDevShapedLine('Home chat checks CI before replies (#99962)')).toBe(true);
    expect(isDevShapedLine('Visitors can read the decision case in English (#99963)')).toBe(false);
    for (const word of ['env', 'api', 'eng']) {
      expect(isDevShapedLine(`Home chat names the ${word} page (#99964)`), word).toBe(false);
    }
    // context stays, because Matt named it explicitly.
    expect(isDevShapedLine('Home chat context lint pass (#99997)')).toBe(true);
    // #1167's raw subject is still dev-shaped via "What’s New:" and "shorthand".
    expect(isDevShapedLine(RAW_1167)).toBe(true);
    expect(isDevShapedLine('What’s New: tidier lines (#99965)')).toBe(true);
    expect(isDevShapedLine('Visitors read shorthand-free lines (#99966)')).toBe(true);
  });

  it('never returns a group with no lines when (b) hides some of a theme', () => {
    const { glance } = painted([
      rel(
        [
          '- abc1234 fix(work): drop the hire-cta class (#99981)',
          '- abc1235 Screen-reader visitors know which panel Menu opens (#978)',
        ].join('\n'),
        '2026-09-20T10:00:00Z'
      ),
    ]);
    for (const group of glance.groups) expect(group.lines.length).toBeGreaterThan(0);
    expect(glance.groups.map((g) => g.heading)).toEqual(['Chat and layout']);
  });
});
