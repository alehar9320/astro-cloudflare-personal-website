import { describe, expect, it } from 'vitest';
import { formatPageviewCount, shouldShowVisitCount } from './visit-stats';

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
