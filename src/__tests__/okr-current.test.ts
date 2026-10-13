import { readFileSync } from 'node:fs';
import { env } from 'cloudflare:workers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  closeRate,
  formatPercent,
  formatUpdated,
  getOkrSnapshot,
  NO_DATA_TTL_MS,
  resetOkrSnapshotCache,
  SNAPSHOT_TTL_MS,
} from '../utils/okr-current';

describe('okr-current snapshot', () => {
  it('computes close-without-merge rate and percent labels (#okr-data)', () => {
    expect(closeRate(9, 1)).toBe(10);
    expect(closeRate(0, 0)).toBeNull();
    expect(formatPercent(closeRate(44, 394))).toBe('90.0%');
    expect(formatPercent(null)).toBe('No data yet');
  });

  it('formats Updated in Stockholm time with a short zone, no RangeError (#okr-data)', () => {
    expect(() => formatUpdated(new Date().toISOString())).not.toThrow();
    expect(formatUpdated(new Date().toISOString())).toMatch(/ CES?T$/);
    expect(formatUpdated('2026-10-13T13:41:00Z')).toBe('13 Oct 2026, 15:41 CEST');
    expect(formatUpdated('2026-10-13T13:49:00Z')).toBe('13 Oct 2026, 15:49 CEST');
    expect(formatUpdated('2026-12-01T08:05:00Z')).toBe('1 Dec 2026, 09:05 CET');
    expect(formatUpdated('not a date')).toBe('');
    const page = readFileSync('src/pages/okr.astro', 'utf8');
    expect(page).toContain('formatUpdated(updatedAt)');
    expect(page).not.toContain('dateStyle');
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

  describe('in-memory snapshot cache (#okr-data)', () => {
    const bindings = env as Record<string, string | undefined>;
    let fetchMock: ReturnType<typeof vi.fn>;

    function upstream(url: string) {
      if (url.startsWith('https://api.github.com/')) return { total_count: 3 };
      if (url.includes('/query/')) return { results: [[7]] };
      return {};
    }

    beforeEach(() => {
      resetOkrSnapshotCache();
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
      bindings.GITHUB_TOKEN = 'test-token';
      bindings.POSTHOG_PERSONAL_API_KEY = 'test-key';
      fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
        const body = String(init?.body ?? '');
        const payload = body.includes('WebOverviewQuery')
          ? { results: [{ key: 'bounce rate', value: 50 }] }
          : upstream(url);
        return new Response(JSON.stringify(payload), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
      delete bindings.GITHUB_TOKEN;
      delete bindings.POSTHOG_PERSONAL_API_KEY;
      resetOkrSnapshotCache();
    });

    it('makes no fetches on a second call within the TTL', async () => {
      const first = await getOkrSnapshot();
      expect(fetchMock).toHaveBeenCalledTimes(7);
      expect(first.metrics['KR3.2'].valueLabel).toBe('3');
      vi.advanceTimersByTime(SNAPSHOT_TTL_MS - 1000);
      const second = await getOkrSnapshot();
      expect(fetchMock).toHaveBeenCalledTimes(7);
      expect(second).toBe(first);
    });

    it('refetches after the TTL', async () => {
      await getOkrSnapshot();
      vi.advanceTimersByTime(SNAPSHOT_TTL_MS + 1);
      await getOkrSnapshot();
      expect(fetchMock).toHaveBeenCalledTimes(14);
    });

    it('shares one fetch between concurrent calls', async () => {
      const results = await Promise.all([getOkrSnapshot(), getOkrSnapshot(), getOkrSnapshot()]);
      expect(fetchMock).toHaveBeenCalledTimes(7);
      expect(results[1]).toBe(results[0]);
      expect(results[2]).toBe(results[0]);
    });

    it('keeps a No data yet snapshot for 60 s only', async () => {
      fetchMock.mockImplementation(async () => new Response('down', { status: 503 }));
      const failed = await getOkrSnapshot();
      expect(failed.metrics['KR3.2'].valueLabel).toBe('No data yet');
      const calls = fetchMock.mock.calls.length;
      vi.advanceTimersByTime(NO_DATA_TTL_MS - 1000);
      await getOkrSnapshot();
      expect(fetchMock).toHaveBeenCalledTimes(calls);
      vi.advanceTimersByTime(2000);
      await getOkrSnapshot();
      expect(fetchMock.mock.calls.length).toBeGreaterThan(calls);
    });
  });
});
