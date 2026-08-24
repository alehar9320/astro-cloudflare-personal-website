import { describe, expect, it } from 'vitest';
import {
  formatColophonVisits,
  formatPageviewCount,
  formatUniqueVisitorCount,
  formatVisitGlance,
  parseVisitGlance,
  shouldShowVisitCount,
} from './visit-stats';

const emptyPeriods = {
  uniqueVisitorsDoD: null,
  uniqueVisitorsWoW: null,
  uniqueVisitorsMoM: null,
  uniqueVisitorsYoY: null,
};

describe('shouldShowVisitCount', () => {
  it('hides 0', () => {
    expect(shouldShowVisitCount(0)).toBe(false);
  });

  it('hides negative numbers', () => {
    expect(shouldShowVisitCount(-1)).toBe(false);
  });

  it('hides NaN', () => {
    expect(shouldShowVisitCount(Number.NaN)).toBe(false);
  });

  it('hides undefined', () => {
    expect(shouldShowVisitCount(undefined)).toBe(false);
  });

  it('shows 1', () => {
    expect(shouldShowVisitCount(1)).toBe(true);
  });

  it('shows 29', () => {
    expect(shouldShowVisitCount(29)).toBe(true);
  });
});

describe('formatPageviewCount', () => {
  it('uses singular for 1', () => {
    expect(formatPageviewCount(1)).toBe('1 pageview');
  });

  it('uses plural for 29', () => {
    expect(formatPageviewCount(29)).toBe('29 pageviews');
  });
});

describe('formatUniqueVisitorCount', () => {
  it('prefixes 1 with up to and uses singular', () => {
    expect(formatUniqueVisitorCount(1)).toBe('up to 1 unique visitor');
  });

  it('prefixes 12 with up to and uses plural', () => {
    expect(formatUniqueVisitorCount(12)).toBe('up to 12 unique visitors');
  });
});

describe('parseVisitGlance', () => {
  it('reads a named object row', () => {
    const glance = parseVisitGlance({
      results: [
        {
          pageviews: 94,
          unique_visitors: 12,
          first_seen: '2026-08-14 07:03:00',
          pageviews_7d: 20,
          unique_visitors_7d: 8,
        },
      ],
    });
    expect(glance?.pageviews).toBe(94);
    expect(glance?.uniqueVisitors).toBe(12);
    expect(glance?.pageviews7d).toBe(20);
    expect(glance?.uniqueVisitors7d).toBe(8);
    expect(glance?.firstSeen).toContain('2026-08-14');
    expect(glance?.uniqueVisitorsDoD).toBeNull();
    expect(glance?.uniqueVisitorsWoW).toBeNull();
    expect(glance?.uniqueVisitorsMoM).toBeNull();
    expect(glance?.uniqueVisitorsYoY).toBeNull();
  });

  it('reads a column-ordered array row', () => {
    const glance = parseVisitGlance({
      columns: ['pageviews', 'unique_visitors', 'first_seen', 'pageviews_7d', 'unique_visitors_7d'],
      results: [[94, 12, '2026-08-14T07:03:00.000Z', 20, 8]],
    });
    expect(glance).toEqual({
      pageviews: 94,
      uniqueVisitors: 12,
      firstSeen: '2026-08-14T07:03:00.000Z',
      pageviews7d: 20,
      uniqueVisitors7d: 8,
      ...emptyPeriods,
    });
  });

  it('parses a zero row so the API can fail-open', () => {
    expect(
      parseVisitGlance({
        results: [
          {
            pageviews: 0,
            unique_visitors: 0,
            first_seen: '2026-08-14T07:03:00.000Z',
            pageviews_7d: 0,
            unique_visitors_7d: 0,
          },
        ],
      })
    ).toEqual({
      pageviews: 0,
      uniqueVisitors: 0,
      firstSeen: '2026-08-14T07:03:00.000Z',
      pageviews7d: 0,
      uniqueVisitors7d: 0,
      ...emptyPeriods,
    });
  });

  it('computes DoD percent from unique visitors and omits a 0 previous', () => {
    const withChange = parseVisitGlance({
      results: [
        {
          pageviews: 94,
          unique_visitors: 12,
          first_seen: '2026-08-14T07:03:00.000Z',
          pageviews_7d: 20,
          unique_visitors_7d: 8,
          unique_visitors_1d: 10,
          unique_visitors_1d_prev: 8,
        },
      ],
    });
    expect(withChange?.uniqueVisitorsDoD).toBe(25);

    const zeroPrev = parseVisitGlance({
      results: [
        {
          pageviews: 94,
          unique_visitors: 12,
          first_seen: '2026-08-14T07:03:00.000Z',
          pageviews_7d: 20,
          unique_visitors_7d: 8,
          unique_visitors_1d: 10,
          unique_visitors_1d_prev: 0,
        },
      ],
    });
    expect(zeroPrev?.uniqueVisitorsDoD).toBeNull();
  });

  it('computes WoW from unique_visitors_7d vs unique_visitors_7d_prev', () => {
    const glance = parseVisitGlance({
      results: [
        {
          pageviews: 94,
          unique_visitors: 12,
          first_seen: '2026-08-14T07:03:00.000Z',
          pageviews_7d: 20,
          unique_visitors_7d: 8,
          unique_visitors_7d_prev: 4,
        },
      ],
    });
    expect(glance?.uniqueVisitorsWoW).toBe(100);
  });
});

describe('formatVisitGlance', () => {
  const glance = {
    pageviews: 242,
    uniqueVisitors: 17,
    firstSeen: '2026-05-03T18:34:08.880Z',
    pageviews7d: 213,
    uniqueVisitors7d: 15,
    ...emptyPeriods,
  };

  it('always includes first seen and last 7 days', () => {
    const lines = formatVisitGlance(glance);
    expect(lines.all).toContain('242 pageviews');
    expect(lines.all).toContain('17 visitors');
    expect(lines.last7d).toContain('last 7 days');
    expect(lines.last7d).toContain('213 pageviews');
    expect(lines.firstSeen).toMatch(/^First seen /);
    expect(lines.firstSeen).toContain('2026');
  });

  it('does not invent 7d numbers when they are zero', () => {
    const lines = formatVisitGlance({ ...glance, pageviews7d: 0, uniqueVisitors7d: 0 });
    expect(lines.last7d).toBe('No visits in the last 7 days');
  });
});

describe('formatColophonVisits', () => {
  const glance = {
    pageviews: 94,
    uniqueVisitors: 12,
    firstSeen: '2026-08-14T07:03:00.000Z',
    pageviews7d: 20,
    uniqueVisitors7d: 8,
    uniqueVisitorsDoD: 25,
    uniqueVisitorsWoW: -10,
    uniqueVisitorsMoM: null,
    uniqueVisitorsYoY: 0,
  };

  it('leads with unique visitors and prefixes every hard figure with up to', () => {
    expect(formatColophonVisits(glance)).toBe(
      'up to 12 unique visitors · DoD up to +25% · WoW up to -10% · YoY up to 0%'
    );
  });

  it('omits missing periods and does not invent 0', () => {
    expect(
      formatColophonVisits({
        ...glance,
        uniqueVisitorsDoD: null,
        uniqueVisitorsWoW: null,
        uniqueVisitorsMoM: null,
        uniqueVisitorsYoY: null,
      })
    ).toBe('up to 12 unique visitors');
  });

  it('uses singular unique visitor for 1', () => {
    expect(formatColophonVisits({ ...glance, uniqueVisitors: 1, uniqueVisitorsDoD: null, uniqueVisitorsWoW: null, uniqueVisitorsYoY: null })).toBe(
      'up to 1 unique visitor'
    );
  });
});
