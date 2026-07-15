import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as astroZod from '../src/__tests__/mocks/astro-zod';
import * as cloudflareWorkers from '../src/__tests__/mocks/cloudflare-workers';
import { createChatStreamParser } from '../src/utils/chat-stream';
import {
  formatReleaseDate,
  parseReleaseItem,
  fetchGitHubReleases,
} from '../src/utils/github-releases';
import { pruneMessages, MAX_TOTAL_CONTENT_LENGTH } from '../src/utils/chat-logic';
import { collections } from '../src/content.config';

describe('StuntDouble: Mocks and Utility Edge Cases', () => {
  beforeEach(() => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('sessionStorage', undefined);
  });

  it('exercises astro-zod mock fully', () => {
    expect(astroZod.z.exerciseMock()).toBe(true);
    const schema = astroZod.z.object({ test: astroZod.z.string() });
    expect(schema.parse({ test: 'pass' })).toEqual({ test: 'pass' });
  });

  it('exercises cloudflare-workers mock', () => {
    expect(cloudflareWorkers.env).toBeDefined();
    expect(typeof cloudflareWorkers.env).toBe('object');
  });

  it('handles multi-line SSE data payloads in chat-stream', () => {
    const parser = createChatStreamParser();
    parser.push('data: {\n');
    parser.push('data: "response": "multi-line success"\n');
    expect(parser.push('data: }\n\n')).toBe('multi-line success');
  });

  describe('github-releases cache edge cases', () => {
    it('handles non-object JSON in cache', async () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('sessionStorage', { getItem: vi.fn().mockReturnValue('123') });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      await fetchGitHubReleases(fetchMock as typeof fetch);
      expect(fetchMock).toHaveBeenCalled();
    });

    it('handles missing timestamp or data in cache', async () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('sessionStorage', {
        getItem: vi.fn().mockReturnValue(JSON.stringify({ data: [] })),
      });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      await fetchGitHubReleases(fetchMock as typeof fetch);
      expect(fetchMock).toHaveBeenCalled();
    });

    it('handles URL mismatch for caching', async () => {
      vi.stubGlobal('window', {});
      const getItem = vi
        .fn()
        .mockReturnValue(JSON.stringify({ data: [{ version: 'v1' }], timestamp: Date.now() }));
      vi.stubGlobal('sessionStorage', { getItem });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      const result = await fetchGitHubReleases(
        fetchMock as typeof fetch,
        'https://api.github.com/other'
      );
      expect(fetchMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('skips cache write when releases array is empty', async () => {
      vi.stubGlobal('window', {});
      const setItem = vi.fn();
      vi.stubGlobal('sessionStorage', { getItem: vi.fn().mockReturnValue(null), setItem });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      await fetchGitHubReleases(fetchMock as typeof fetch);
      expect(setItem).not.toHaveBeenCalled();
    });
  });

  it('keeps both messages when exactly at MAX_TOTAL_CONTENT_LENGTH', () => {
    const messages = [
      { role: 'user' as const, content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH - 1) },
      { role: 'assistant' as const, content: 'b' },
    ];
    expect(pruneMessages(messages)).toHaveLength(2);
  });

  it('prunes to one message when just over MAX_TOTAL_CONTENT_LENGTH', () => {
    const overMessages = [
      { role: 'user' as const, content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH) },
      { role: 'assistant' as const, content: 'b' },
    ];
    expect(pruneMessages(overMessages)).toHaveLength(1);
  });

  it('validates content.config flags schema defaults', () => {
    const { schema } = collections.flags;
    if (!schema || typeof schema === 'function') return;
    const result = schema.parse({});
    expect(result.portfolio_tactile_v1).toBe(false);
    expect(result.enable_strategic_pulse).toBe(false);
    expect(result.enable_reading_list).toBe(false);
  });

  it('handles invalid dates and parse items in github-releases', () => {
    expect(formatReleaseDate('invalid-date')).toBe('Unknown date');
    expect(parseReleaseItem('just some text')).toEqual({ message: 'just some text' });
  });
});
