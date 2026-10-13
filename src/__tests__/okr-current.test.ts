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
    expect(formatUpdated('')).toBe('');
    expect(formatUpdated(undefined as unknown as string)).toBe('');
    expect(formatUpdated(Symbol('x') as unknown as string)).toBe('');
    expect(formatUpdated(new Date('2026-07-01T10:00:00Z').toISOString())).toBe(
      '1 Jul 2026, 12:00 CEST'
    );
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

    it('fails open per source when bindings are missing or invalid', async () => {
      delete bindings.GITHUB_TOKEN;
      bindings.POSTHOG_QUERY_HOST = 'http://insecure.example';
      const snap = await getOkrSnapshot();
      expect(fetchMock).not.toHaveBeenCalled();
      for (const id of ['KR1.1', 'KR1.2', 'KR2.2', 'KR3.1', 'KR3.2', 'KR3.3']) {
        expect(snap.metrics[id].valueLabel).toBe('No data yet');
        expect(snap.metrics[id].updatedAt).toBeNull();
      }
      resetOkrSnapshotCache();
      bindings.POSTHOG_QUERY_HOST = 'not a url';
      await getOkrSnapshot();
      resetOkrSnapshotCache();
      delete bindings.POSTHOG_QUERY_HOST;
      bindings.POSTHOG_PROJECT_ID = 'abc';
      await getOkrSnapshot();
      expect(fetchMock).not.toHaveBeenCalled();
      delete bindings.POSTHOG_PROJECT_ID;
    });

    it('treats unexpected upstream shapes as No data yet', async () => {
      fetchMock.mockImplementation(
        async () => new Response(JSON.stringify({ results: [{ key: 'other' }] }), { status: 200 })
      );
      const snap = await getOkrSnapshot();
      expect(snap.metrics['KR3.1'].valueLabel).toBe('No data yet');
      expect(snap.metrics['KR1.2'].valueLabel).toBe('No data yet');
      resetOkrSnapshotCache();
      fetchMock.mockImplementation(
        async () => new Response(JSON.stringify({ results: 'x' }), { status: 200 })
      );
      const snap2 = await getOkrSnapshot();
      expect(snap2.metrics['KR1.1'].valueLabel).toBe('No data yet');
    });

    it('reports a null close rate when nothing closed in 30 days', async () => {
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        const body = String(init?.body ?? '');
        const payload = url.startsWith('https://api.github.com/')
          ? { total_count: 0 }
          : body.includes('WebOverviewQuery')
            ? { results: [{ key: 'bounce rate', value: 40 }] }
            : { results: [[2]] };
        return new Response(JSON.stringify(payload), { status: 200 });
      });
      const snap = await getOkrSnapshot();
      expect(snap.metrics['KR3.3']).toMatchObject({ value: null, valueLabel: 'No data yet' });
      expect(snap.metrics['KR3.3'].updatedAt).toBeNull();
      expect(snap.metrics['KR1.2'].valueLabel).toBe('40.0%');
    });

    it('aborts an upstream call after 3000 ms', async () => {
      fetchMock.mockImplementation(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
          })
      );
      const pending = getOkrSnapshot();
      await vi.advanceTimersByTimeAsync(3000);
      const snap = await pending;
      expect(snap.metrics['KR3.2'].valueLabel).toBe('No data yet');
      expect(snap.metrics['KR1.1'].valueLabel).toBe('No data yet');
    });

    it('uses the Cache API as an extra layer for healthy snapshots only', async () => {
      const store = new Map<string, Response>();
      const cache = {
        match: vi.fn(async (key: string) => store.get(key)?.clone()),
        put: vi.fn(async (key: string, res: Response) => {
          store.set(key, res);
        }),
      };
      vi.stubGlobal('caches', { default: cache });
      const first = await getOkrSnapshot();
      expect(cache.put).toHaveBeenCalledTimes(1);
      expect(cache.put.mock.calls[0][0]).toBe('https://me.alehar.workers.dev/__okr-snapshot-v1');
      expect(cache.put.mock.calls[0][1].headers.get('Cache-Control')).toBe('max-age=3600');
      resetOkrSnapshotCache();
      const second = await getOkrSnapshot();
      expect(fetchMock).toHaveBeenCalledTimes(7);
      expect(second).toEqual(first);
    });

    it('survives a throwing Cache API', async () => {
      vi.stubGlobal('caches', {
        default: {
          match: async () => {
            throw new Error('boom');
          },
          put: async () => {
            throw new Error('boom');
          },
        },
      });
      const snap = await getOkrSnapshot();
      expect(snap.metrics['KR3.2'].valueLabel).toBe('3');
      resetOkrSnapshotCache();
      vi.stubGlobal('caches', {
        get default() {
          throw new Error('no cache');
        },
      });
      expect((await getOkrSnapshot()).metrics['KR3.2'].valueLabel).toBe('3');
    });

    it('fails one metric on its own and warns without secrets', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const base = fetchMock.getMockImplementation()!;
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        const body = String(init?.body ?? '');
        if (body.includes('LinkedIn hire')) return new Response('slow', { status: 504 });
        if (url.includes('is:open')) throw Object.assign(new Error('x'), { name: 'AbortError' });
        return base(url, init);
      });
      const snap = await getOkrSnapshot();
      expect(snap.metrics['KR1.1']).toMatchObject({ valueLabel: '7', source: 'PostHog' });
      expect(snap.metrics['KR1.1'].updatedAt).not.toBeNull();
      expect(snap.metrics['KR1.2'].valueLabel).toBe('50.0%');
      expect(snap.metrics['KR2.2']).toMatchObject({ valueLabel: 'No data yet', updatedAt: null });
      expect(snap.metrics['KR3.1'].valueLabel).toBe('3');
      expect(snap.metrics['KR3.2'].valueLabel).toBe('No data yet');
      expect(snap.metrics['KR3.3'].valueLabel).toBe('50.0%');
      const logged = JSON.stringify(warn.mock.calls);
      expect(logged).toContain('"id":"KR2.2"');
      expect(logged).toContain('posthog 504');
      expect(logged).toContain('"id":"KR3.2"');
      expect(logged).toContain('timeout');
      expect(logged).not.toContain('test-key');
      expect(logged).not.toContain('test-token');
      warn.mockRestore();
    });

    it('warns when a source is unconfigured', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      delete bindings.POSTHOG_PERSONAL_API_KEY;
      await getOkrSnapshot();
      expect(JSON.stringify(warn.mock.calls)).toContain('no key');
      warn.mockRestore();
    });
  });
});
