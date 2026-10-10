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
import { shouldShowUpdatesUnavailable } from '../utils/whats-new-releases';

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

  it('shows the #1579 empty state, never a blank heading, when (b) hides every line', () => {
    const releases = [
      rel('- abc1234 fix(chat): give the chat composer a clearer focus ring (#99992)'),
    ];
    const glance = buildWhatsNewGlance(releases.map(toVisitorRelease), NOW);
    expect(glance).toEqual({ groups: [], thisWeek: [] });
    expect(shouldShowUpdatesUnavailable({ state: 'fresh', releases }, glance)).toBe(true);
    expect(shouldShowUpdatesUnavailable({ state: 'cached', releases }, glance)).toBe(true);
    // A genuinely empty list is still not an error (#1666).
    expect(shouldShowUpdatesUnavailable({ state: 'fresh', releases: [] }, glance)).toBe(false);
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
