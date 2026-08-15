import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env as workerEnv } from 'cloudflare:workers';
import { GET, type ReleaseSummaryEnv } from '../pages/api/release-summary';
import * as githubReleases from '../utils/github-releases';
import {
  isSafeReleaseSummary,
  parseModelText,
  releaseSummaryKey,
  releaseSummaryPrompt,
} from '../utils/release-summary';

type GetContext = Parameters<typeof GET>[0];

function createContext(runtimeEnv: unknown = {}) {
  const bindings = workerEnv as ReleaseSummaryEnv;
  delete bindings.AI;
  delete bindings.CHAT_STORE;
  Object.assign(bindings, runtimeEnv as ReleaseSummaryEnv);
  return {
    request: new Request('https://example.com/api/release-summary'),
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

describe('isSafeReleaseSummary', () => {
  const source = `${latest.version}\n${latest.body}`;

  it('accepts 2-4 plain sentences grounded in the notes', () => {
    expect(isSafeReleaseSummary(okSummary, source)).toBe(true);
  });

  it('rejects Palette and Oracle names', () => {
    expect(
      isSafeReleaseSummary('Palette shipped the glance. Oracle reviewed the overlay.', source)
    ).toBe(false);
  });

  it('rejects invented metrics', () => {
    expect(
      isSafeReleaseSummary('The glance shows 2x faster delivery. It also claims 30x ROI.', source)
    ).toBe(false);
  });

  it('rejects a one-sentence answer', () => {
    expect(isSafeReleaseSummary('The release adds a footer glance.', source)).toBe(false);
  });
});

describe('release summary helpers', () => {
  it('caches by tag', () => {
    expect(releaseSummaryKey('2026.08.15.1714')).toBe('release-summary:2026.08.15.1714');
  });

  it('asks for 2-4 sentences and no invented metrics', () => {
    const prompt = releaseSummaryPrompt(latest.version, latest.body);
    expect(prompt).toContain('2 to 4 plain-English sentences');
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
    expect(get).toHaveBeenCalledWith('release-summary:2026.08.15.1714');
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
    expect(put).toHaveBeenCalledWith('release-summary:2026.08.15.1714', okSummary);
  });

  it('fails open with 204 when AI is missing', async () => {
    const response = await GET(createContext({}));
    expect(response.status).toBe(204);
  });

  it('fails open with 204 when the model invents metrics', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const put = vi.fn();
    const ai = {
      run: vi.fn().mockResolvedValue({
        response: 'This release delivered 2x faster delivery. It also hit 30x ROI.',
      }),
    };
    const response = await GET(
      createContext({ AI: ai, CHAT_STORE: { get, put } as unknown as KVNamespace })
    );

    expect(response.status).toBe(204);
    expect(put).not.toHaveBeenCalled();
  });

  it('fails open with 204 when GitHub has no releases', async () => {
    vi.spyOn(githubReleases, 'fetchGitHubReleases').mockResolvedValue([]);
    const ai = { run: vi.fn() };
    const response = await GET(createContext({ AI: ai }));
    expect(response.status).toBe(204);
    expect(ai.run).not.toHaveBeenCalled();
  });
});
