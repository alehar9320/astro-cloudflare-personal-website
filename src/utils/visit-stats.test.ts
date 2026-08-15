import { describe, expect, it } from 'vitest';
import { formatPageviewCount, parseVisitGlance, shouldShowVisitCount } from './visit-stats';

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
    });
  });
});
