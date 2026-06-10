import { describe, expect, it } from 'vitest';
import {
  pruneMessages,
  MAX_MESSAGES,
  MAX_TOTAL_CONTENT_LENGTH,
  type ChatMessage,
} from './chat-logic';

describe('chat logic utilities', () => {
  describe('pruneMessages', () => {
    it('returns the same messages if within limits', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
      ];
      expect(pruneMessages(messages)).toEqual(messages);
    });

    it('prunes messages if exceeding MAX_MESSAGES', () => {
      const messages: ChatMessage[] = Array.from({ length: MAX_MESSAGES + 5 }, (_, i) => ({
        role: 'user',
        content: `Message ${i}`,
      }));

      const pruned = pruneMessages(messages);
      expect(pruned.length).toBe(MAX_MESSAGES);
      expect(pruned[0].content).toBe(`Message 5`);
      expect(pruned[MAX_MESSAGES - 1].content).toBe(`Message ${MAX_MESSAGES + 4}`);
    });

    it('prunes messages if exceeding MAX_TOTAL_CONTENT_LENGTH', () => {
      const longContent = 'a'.repeat(400);
      const messages: ChatMessage[] = Array.from({ length: 10 }, () => ({
        role: 'user',
        content: longContent,
      }));

      // Total length = 4000, limit = 3000.
      // 10 * 400 = 4000. To get below 3000, we need to remove 3 messages (10, 9, 8, 7 remaining -> 2800)
      const pruned = pruneMessages(messages);
      expect(pruned.length).toBe(7);
      expect(pruned.reduce((acc, m) => acc + m.content.length, 0)).toBeLessThanOrEqual(
        MAX_TOTAL_CONTENT_LENGTH
      );
    });

    it('keeps at least one message even if it exceeds MAX_TOTAL_CONTENT_LENGTH', () => {
      const veryLongContent = 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH + 100);
      const messages: ChatMessage[] = [{ role: 'user', content: veryLongContent }];

      const pruned = pruneMessages(messages);
      expect(pruned.length).toBe(1);
      expect(pruned[0].content).toBe(veryLongContent);
    });

    it('handles the case where removed message from shift() is undefined', () => {
      const longMessages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH) },
        { role: 'user', content: 'b' },
      ];
      expect(pruneMessages(longMessages)).toHaveLength(1);
    });

    it('handles defensive check for shift() returning undefined (line coverage)', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH + 1) },
        { role: 'user', content: 'b' },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toBe('b');
    });

    it('handles empty message array', () => {
      expect(pruneMessages([])).toEqual([]);
    });

    it('trims whitespace from message content', () => {
      const messages: ChatMessage[] = [{ role: 'user', content: '  hello  ' }];
      expect(pruneMessages(messages)).toEqual([{ role: 'user', content: '  hello  ' }]);
    });

    it('removes messages when the first message alone is too long and there are others', () => {
      const veryLongContent = 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH + 1);
      const messages: ChatMessage[] = [
        { role: 'user', content: veryLongContent },
        { role: 'assistant', content: 'short' },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toBe('short');
    });

    it('preserves exactly MAX_MESSAGES when limit is reached', () => {
      const messages: ChatMessage[] = Array.from({ length: MAX_MESSAGES }, (_, i) => ({
        role: 'user',
        content: `msg ${i}`,
      }));
      expect(pruneMessages(messages)).toHaveLength(MAX_MESSAGES);
    });

    it('preserves exactly MAX_TOTAL_CONTENT_LENGTH when limit is reached', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH - 10) },
        { role: 'assistant', content: '1234567890' },
      ];
      const pruned = pruneMessages(messages);
      const totalLen = pruned.reduce((acc, m) => acc + m.content.length, 0);
      expect(totalLen).toBe(MAX_TOTAL_CONTENT_LENGTH);
      expect(pruned).toHaveLength(2);
    });
  });
});
