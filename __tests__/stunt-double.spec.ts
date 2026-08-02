import { describe, it, expect, vi } from 'vitest';
import * as astroZod from '../src/__tests__/mocks/astro-zod';
import * as cloudflareWorkers from '../src/__tests__/mocks/cloudflare-workers';
import { createChatStreamParser, extractAssistantTextFromSse } from '../src/utils/chat-stream';
import { pruneMessages } from '../src/utils/chat-logic';
import {
  formatReleaseDate,
  parseReleaseItem,
  fetchGitHubReleases,
} from '../src/utils/github-releases';

describe('StuntDouble: Mocks and Utility Edge Cases', () => {
  it('exercises astro-zod mock to ensure coverage', () => {
    expect(astroZod.z).toBeDefined();
    const schema = astroZod.z.object({ test: astroZod.z.string() });
    expect(schema.parse({ test: 'pass' })).toEqual({ test: 'pass' });
  });

  it('exercises cloudflare-workers mock to ensure coverage', () => {
    expect(cloudflareWorkers.env).toBeDefined();
    expect(typeof cloudflareWorkers.env).toBe('object');
  });

  it('handles multi-line SSE data payloads in chat-stream', () => {
    const parser = createChatStreamParser();
    parser.push('data: {\n');
    parser.push('data: "response": "multi-line success"\n');
    expect(parser.push('data: }\n\n')).toBe('multi-line success');
  });

  it('handles non-object but truthy JSON payloads in chat-stream', () => {
    const parser = createChatStreamParser();
    parser.push('data: ["not", "a", "record"]\n\n');
    expect(parser.push('')).toBe('');
    parser.push('data: 123\n\n');
    expect(parser.push('')).toBe('');
    parser.push('data: "just a string"\n\n');
    expect(parser.push('')).toBe('');
  });

  it('handles invalid dates in formatReleaseDate', () => {
    expect(formatReleaseDate('invalid-date')).toBe('Unknown date');
    expect(formatReleaseDate('')).toBe('Unknown date');
  });

  it('handles parseReleaseItem with non-hash strings', () => {
    expect(parseReleaseItem('just some text')).toEqual({ message: 'just some text' });
    expect(parseReleaseItem('  spaced text  ')).toEqual({ message: 'spaced text' });
  });

  it('handles fetchGitHubReleases with non-array responses', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ not: 'an array' }),
    });

    const result = await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith({
      event: 'github_releases_validation_failed',
      issues: expect.any(Array),
    });
    consoleSpy.mockRestore();
  });

  it('handles fetchGitHubReleases when sessionStorage contains invalid JSON or non-object cache', async () => {
    vi.stubGlobal('window', {});
    const getItemSpy = vi.fn().mockReturnValue('invalid JSON string{');
    vi.stubGlobal('sessionStorage', { getItem: getItemSpy });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(result).toEqual([]);
    expect(getItemSpy).toHaveBeenCalledWith('github-releases-cache');

    vi.unstubAllGlobals();
  });

  it('handles extractAssistantTextFromSse with multi-line/whitespace-padded attributes', () => {
    const sse = 'data:    {\n' + 'data:       "response": "padded message"\n' + 'data:    }\n\n';
    expect(extractAssistantTextFromSse(sse)).toBe('padded message');
  });

  it('handles pruneMessages with empty content or special unicode characters', () => {
    const messages = [
      { role: 'user' as const, content: '✨ Unicode Special Characters 🚀' },
      { role: 'assistant' as const, content: '   ' }, // Should fail message content cannot be empty if parsed, but pruneMessages itself doesn't validate Zod
    ];
    const pruned = pruneMessages(messages);
    expect(pruned).toEqual(messages);
    expect(pruned[0].content).toContain('✨');
  });

  it('handles formatReleaseDate with extremely unusual inputs', () => {
    expect(formatReleaseDate('9999-99-99T99:99:99Z')).toBe('Unknown date');
    expect(formatReleaseDate('0000-00-00')).toBe('Unknown date');
    expect(formatReleaseDate('completely invalid date string')).toBe('Unknown date');
  });
});
