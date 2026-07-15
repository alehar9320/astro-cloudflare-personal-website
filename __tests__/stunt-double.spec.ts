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

  it('handles github-releases cache corruption and edge cases', async () => {
    vi.stubGlobal('window', {});

    // Case 1: Non-object JSON in cache
    const getItem = vi.fn().mockReturnValue('123');
    vi.stubGlobal('sessionStorage', { getItem });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(fetchMock).toHaveBeenCalled();

    // Case 2: Missing timestamp or data in cache
    getItem.mockReturnValue(JSON.stringify({ data: [] }));
    await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Case 3: URL mismatch for caching
    getItem.mockReturnValue(JSON.stringify({ data: [{ version: 'v1' }], timestamp: Date.now() }));
    const result = await fetchGitHubReleases(
      fetchMock as typeof fetch,
      'https://api.github.com/other'
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual([]);

    // Case 4: No cache write when releases array is empty
    const setItem = vi.fn();
    vi.stubGlobal('sessionStorage', { getItem: vi.fn().mockReturnValue(null), setItem });
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('handles chat-logic boundary condition for total content length', () => {
    const messages = [
      { role: 'user' as const, content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH - 1) },
      { role: 'assistant' as const, content: 'b' },
    ];
    // Total is exactly MAX_TOTAL_CONTENT_LENGTH
    expect(pruneMessages(messages)).toHaveLength(2);

    const overMessages = [
      { role: 'user' as const, content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH) },
      { role: 'assistant' as const, content: 'b' },
    ];
    // Total is MAX_TOTAL_CONTENT_LENGTH + 1
    expect(pruneMessages(overMessages)).toHaveLength(1);
  });

  it('validates content.config flags schema defaults', () => {
    const { schema } = collections.flags;
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
