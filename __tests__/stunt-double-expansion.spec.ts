import { describe, it, expect, vi } from 'vitest';
import { createChatStreamParser, extractAssistantTextFromSse } from '../src/utils/chat-stream';
import {
  parseReleaseItem,
  formatReleaseDate,
  fetchGitHubReleases,
} from '../src/utils/github-releases';
import { pruneMessages, MAX_TOTAL_CONTENT_LENGTH, type ChatMessage } from '../src/utils/chat-logic';

describe('StuntDouble Expansion: Deep Edge Cases', () => {
  describe('chat-stream edge cases', () => {
    it('handles SSE payloads that only contain event markers', () => {
      // should return empty string for event-only lines
      expect(extractAssistantTextFromSse('event: ping\n\n')).toBe('');
    });

    it('handles JSON payloads where "response" is not a string', () => {
      const parser = createChatStreamParser();
      // @ts-expect-error - testing invalid runtime data
      parser.push('data: {"response": 123}\n\n');
      expect(parser.flush()).toBe('');
    });

    it('buffers and flushes partial events correctly', () => {
      const parser = createChatStreamParser();
      const first = parser.push('data: {"response": "part1"}\n\ndata: {"response": "part2"}');
      // "part1" should be returned immediately because it's followed by \n\n
      expect(first).toBe('part1');
      // "part2" event is not followed by \n\n, so it's buffered
      expect(parser.push('')).toBe('');
      expect(parser.flush()).toBe('part2');
    });

    it('handles malformed JSON in SSE data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const parser = createChatStreamParser();
      parser.push('data: {invalid-json}\n\n');
      expect(parser.flush()).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'chat_stream_parse_error' })
      );
      consoleSpy.mockRestore();
    });
  });

  describe('github-releases edge cases', () => {
    it('does not treat 8-character hex strings as hashes', () => {
      // The regex is exactly 7 chars: /^([a-f0-9]{7})\s+(.*)/
      const item = parseReleaseItem('abcdef12 message');
      expect(item.hash).toBeUndefined();
      expect(item.message).toBe('abcdef12 message');
    });

    it('handles empty release date strings', () => {
      expect(formatReleaseDate('')).toBe('Unknown date');
    });

    it('logs non-OK API responses without sensitive headers', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await fetchGitHubReleases(fetchMock as typeof fetch);
      expect(consoleSpy).toHaveBeenCalledWith({
        event: 'github_releases_request_failed',
        status: 403,
        statusText: 'Forbidden',
      });
      consoleSpy.mockRestore();
    });
  });

  describe('chat-logic edge cases', () => {
    it('prunes to exactly one message if the first message is exactly at the limit', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH) },
        { role: 'assistant', content: 'too much' },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toBe('too much');
    });

    it('keeps a single message even if it is slightly over the limit', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH + 1) },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toHaveLength(MAX_TOTAL_CONTENT_LENGTH + 1);
    });
  });
});
