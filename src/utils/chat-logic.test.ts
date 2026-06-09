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

    it('handles empty message array', () => {
      expect(pruneMessages([])).toEqual([]);
    });

    it('trims whitespace from message content', () => {
      // Note: Zod schema handles trimming on parse,
      // but pruneMessages operates on the raw content of the input objects.
      const messages: ChatMessage[] = [{ role: 'user', content: '  hello  ' }];
      expect(pruneMessages(messages)).toEqual([{ role: 'user', content: '  hello  ' }]);
    });
  });
});
