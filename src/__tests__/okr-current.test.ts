import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { closeRate, formatPercent } from '../utils/okr-current';

describe('okr-current snapshot', () => {
  it('computes close-without-merge rate and percent labels (#okr-data)', () => {
    expect(closeRate(9, 1)).toBe(10);
    expect(closeRate(0, 0)).toBeNull();
    expect(formatPercent(closeRate(44, 394))).toBe('90.0%');
    expect(formatPercent(null)).toBe('No data yet');
  });

  it('locks recipes, hourly cache, timeout, and fail-open (#okr-data)', () => {
    const src = readFileSync('src/utils/okr-current.ts', 'utf8');
    expect(src).toContain('caches.default');
    expect(src).toContain('__okr-snapshot-v1');
    expect(src).toContain('max-age=3600');
    expect(src).toContain('AbortController');
    expect(src).toContain('3000');
    expect(src).toContain("'me.alehar.workers.dev'");
    expect(src).toContain("!= 'Linux'");
    expect(src).toContain('Contact card — Get in touch / LinkedIn hire');
    expect(src).toContain('elements_chain_href');
    expect(src).toContain('is:pr+is:open');
    expect(src).toContain('is:unmerged');
    expect(src).toContain('base:main');
    expect(src).toContain('No data yet');
    expect(src).not.toContain('/deployments');
  });
});
