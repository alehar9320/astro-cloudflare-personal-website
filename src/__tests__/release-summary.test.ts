import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env as workerEnv } from 'cloudflare:workers';
import { GET, POST, type ReleaseSummaryEnv } from '../pages/api/release-summary';
import * as githubReleases from '../utils/github-releases';
import {
  groundedReleaseSummary,
  isSafeReleaseSummary,
  parseModelText,
  prepareReleaseSummary,
  releaseSummaryKey,
  releaseSummaryPrompt,
} from '../utils/release-summary';

type GetContext = Parameters<typeof GET>[0];

function createContext(
  runtimeEnv: unknown = {},
  request = new Request('https://example.com/api/release-summary')
) {
  const bindings = workerEnv as ReleaseSummaryEnv;
  delete bindings.AI;
  delete bindings.CHAT_STORE;
  Object.assign(bindings, runtimeEnv as ReleaseSummaryEnv);
  return {
    request,
    locals: {},
  } as unknown as GetContext;
}

const latest = {
  body: '- 5a5a58a feat: inline footer pageviews with an exec glance (#460)',
  publishedAt: '2026-08-15T17:14:07Z',
  title: '2026.08.15.1714',
  url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.15.1714',
  version: '2026.08.15.1714',
};

const okSummary =
  'The latest release adds an executive glance for footer pageviews. The count sits on the colophon and opens a short overlay. Changelog details stay on this page.';

const notesFallback =
  'The latest release is 2026.08.15.1714. Visitors can now inline footer pageviews with an exec glance. The full changelog is listed below.';

describe('isSafeReleaseSummary', () => {
  const source = `${latest.version}\n${latest.body}`;

  it('accepts 2-4 plain sentences grounded in the notes', () => {
    expect(isSafeReleaseSummary(okSummary, source)).toBe(true);
  });

  it('rejects invented 2x / 30x that are not in the notes', () => {
    expect(
      isSafeReleaseSummary(
        'The IFS Design System delivered 2x faster delivery and 30x ROI. That is the numbered proof. Changelog is below.',
        source
      )
    ).toBe(false);
  });

  it('rejects invented metrics that are not 2x or 30x', () => {
    expect(
      isSafeReleaseSummary(
        'This release reached 12 million visitors. It also claims 40% conversion.',
        source
      )
    ).toBe(false);
  });

  it('rejects a one-sentence answer', () => {
    expect(isSafeReleaseSummary('The release adds a footer glance.', source)).toBe(false);
  });
});

describe('prepareReleaseSummary', () => {
  const source = `${latest.version}\n${latest.body}`;

  it('strips Palette, Oracle, and Jules instead of dropping the box', () => {
    expect(
      prepareReleaseSummary(
        'Jules shipped the glance. Palette reviewed the overlay. Changelog stays below.',
        source
      )
    ).toBe('shipped the glance. reviewed the overlay. Changelog stays below.');
  });

  it('drops SHA-y model text so the notes fallback can speak', () => {
    expect(
      prepareReleaseSummary(
        'The glance opens on tap. The fix landed in 66e3fe9. Changelog stays below.',
        source
      )
    ).toBe(null);
  });
});

describe('release summary helpers', () => {
  it('builds a 3-sentence notes-only fallback from title and bullets', () => {
    expect(groundedReleaseSummary(latest.version, latest.body, latest.title)).toBe(notesFallback);
  });

  it('keeps the box when notes name Jules', () => {
    const body = '- abcdef1 Jules: open visit glance on tap (#461)';
    const summary = groundedReleaseSummary('2026.08.15.1720', body, '2026.08.15.1720');
    expect(summary).toContain('The latest release is 2026.08.15.1720.');
    expect(summary).toContain('open visit glance on tap');
    expect(summary).not.toMatch(/jules/i);
    expect(summary).not.toMatch(/\babcdef1\b/);
  });

  it('caches by tag', () => {
    expect(releaseSummaryKey('2026.08.15.1714')).toBe('release-summary:v2:2026.08.15.1714');
  });

  it('asks for 2-4 sentences and no invented metrics', () => {
    const prompt = releaseSummaryPrompt(latest.version, latest.body);
    expect(prompt).toContain('exactly three plain-English sentences for a hiring manager');
    expect(prompt).toContain('Do not invent metrics');
    expect(prompt).toContain('Palettes, Oracles');
    expect(prompt).toContain(latest.body);
  });

  it('reads Workers AI text from response', () => {
    expect(parseModelText({ response: `  ${okSummary}  ` })).toBe(okSummary);
    expect(parseModelText(null)).toBe('');
  });
});

describe('release summary API', () => {
  beforeEach(() => {
    const bindings = workerEnv as ReleaseSummaryEnv;
    delete bindings.AI;
    delete bindings.CHAT_STORE;
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([latest]);
  });

  it('returns a cached summary for the latest tag without calling AI', async () => {
    const get = vi.fn().mockResolvedValue(okSummary);
    const put = vi.fn();
    const ai = { run: vi.fn() };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: okSummary,
    });
    expect(get).toHaveBeenCalledWith('release-summary:v2:2026.08.15.1714');
    expect(ai.run).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it('generates, caches by tag, and returns 2-4 sentences', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const put = vi.fn();
    const ai = { run: vi.fn().mockResolvedValue({ response: okSummary }) };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: okSummary,
    });
    expect(ai.run).toHaveBeenCalledWith(
      '@cf/meta/llama-3.1-8b-instruct-fast',
      expect.objectContaining({ stream: false })
    );
    expect(put).toHaveBeenCalledWith('release-summary:v2:2026.08.15.1714', okSummary);
  });

  it('uses a notes-only fallback when AI is missing', async () => {
    const response = await GET(createContext({}));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: notesFallback,
    });
  });

  it('strips Jules from AI text and still returns the box', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const put = vi.fn();
    const ai = {
      run: vi.fn().mockResolvedValue({
        response: 'Jules shipped the glance. Palette reviewed the overlay. Changelog stays below.',
      }),
    };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: 'shipped the glance. reviewed the overlay. Changelog stays below.',
    });
  });

  it('does not serve invented visitor metrics and falls back to the notes', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const put = vi.fn();
    const ai = {
      run: vi.fn().mockResolvedValue({
        response: 'This release reached 12 million visitors. It also claims 40% conversion.',
      }),
    };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: notesFallback,
    });
    expect(put).toHaveBeenCalledWith('release-summary:v2:2026.08.15.1714', notesFallback);
  });

  it('drops invented 2x / 30x and falls back to the notes', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const put = vi.fn();
    const proof =
      'The IFS Design System delivered 2x faster delivery and 30x ROI. That is the numbered proof. Changelog is below.';
    const ai = { run: vi.fn().mockResolvedValue({ response: proof }) };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: notesFallback,
    });
  });

  it('uses the snapshot release when GitHub is empty', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);
    const response = await GET(createContext({}));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: '2026.08.15.1720',
      summary:
        'The latest release is 2026.08.15.1720. Visitors can now open the visit glance on tap at 375. The full changelog is listed below.',
    });
  });

  it('summarizes a POSTed release without calling GitHub', async () => {
    const fetchSpy = vi.spyOn(githubReleases, 'fetchGitHubReleases');
    fetchSpy.mockClear();
    const request = new Request('https://example.com/api/release-summary', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tag: latest.version,
        title: latest.title,
        body: latest.body,
      }),
    });
    const response = await POST(createContext({}, request));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tag: latest.version,
      summary: notesFallback,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
