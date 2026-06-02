import { describe, expect, it } from 'vitest';
import {
  MAX_MESSAGES,
  MAX_TOTAL_CONTENT_LENGTH,
  normalizeMessage,
  pruneMessages,
} from './chat-logic';

describe('chat logic', () => {
  describe('normalizeMessage', () => {
    it('handles legacy ai role', () => {
      const result = normalizeMessage({ role: 'ai', content: 'hello' });
      expect(result).toEqual({ role: 'assistant', content: 'hello' });
    });

    it('trims content and handles empty content', () => {
      expect(normalizeMessage({ role: 'user', content: '  hi  ' }).content).toBe('hi');
      expect(normalizeMessage({ role: 'user', content: '' }).content).toBe('...');
    });

    it('enforces max length per message', () => {
      const long = 'a'.repeat(600);
      expect(normalizeMessage({ role: 'user', content: long }).content.length).toBe(500);
    });
  });

  describe('pruneMessages', () => {
    it('respects MAX_MESSAGES by keeping the most recent', () => {
      const msgs = Array.from({ length: 15 }, (_, i) => ({
        role: 'user' as const,
        content: `msg ${i}`,
      }));
      const pruned = pruneMessages(msgs);
      expect(pruned.length).toBe(MAX_MESSAGES);
      expect(pruned[pruned.length - 1].content).toBe('msg 14');
      expect(pruned[0].content).toBe('msg 5');
    });

    it('respects MAX_TOTAL_CONTENT_LENGTH by sliding window', () => {
      const msgs = [
        { role: 'user' as const, content: 'a'.repeat(2000) },
        { role: 'assistant' as const, content: 'b'.repeat(1500) },
      ];
      const pruned = pruneMessages(msgs);
      // Total is 3500, MAX is 3000. It should drop the first one.
      expect(pruned.length).toBe(1);
      expect(pruned[0].content).toBe('b'.repeat(1500));
    });

    it('handles a single message exceeding total limit by pruning it', () => {
      const msgs = [{ role: 'user' as const, content: 'a'.repeat(4000) }];
      const pruned = pruneMessages(msgs);
      expect(pruned.length).toBe(1);
      expect(pruned[0].content.length).toBe(MAX_TOTAL_CONTENT_LENGTH);
    });
  });
});
