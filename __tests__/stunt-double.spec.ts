import { describe, it, expect, vi } from 'vitest';
import * as astroZod from '../src/__tests__/mocks/astro-zod';
import * as cloudflareWorkers from '../src/__tests__/mocks/cloudflare-workers';
import { createChatStreamParser } from '../src/utils/chat-stream';
import {
  formatReleaseDate,
  parseReleaseItem,
  fetchGitHubReleases,
  normalizeRelease,
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

  it('handles malformed JSON in sessionStorage for fetchGitHubReleases', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn().mockReturnValue('invalid-json'),
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await fetchGitHubReleases(fetchMock as typeof fetch);
    expect(result).toEqual([]);
    expect(fetchMock).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('handles whitespace-only name in normalizeRelease', () => {
    const release = {
      tag_name: 'v1.0.0',
      name: '   ',
      body: 'body',
    };
    const normalized = normalizeRelease(release);
    expect(normalized?.title).toBe('v1.0.0');
  });

  it('skips cache when fetchGitHubReleases is called with a custom URL', async () => {
    vi.stubGlobal('window', {});
    const getItem = vi.fn();
    vi.stubGlobal('sessionStorage', { getItem });

    const customUrl = 'https://api.github.com/repos/user/repo/releases';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await fetchGitHubReleases(fetchMock as typeof fetch, customUrl);
    expect(getItem).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
