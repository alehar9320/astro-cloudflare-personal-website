import { describe, expect, it } from 'vitest';
import {
  type ChatMessage,
  ChatMessageSchema,
  ChatRequestSchema,
  MAX_MESSAGE_CONTENT_LENGTH,
  MAX_MESSAGES,
  pruneMessages,
} from './chat-logic';

describe('chat-logic', () => {
  describe('ChatMessageSchema', () => {
    it('validates a correct message', () => {
      const msg = { role: 'user', content: 'Hello' };
      expect(ChatMessageSchema.parse(msg)).toEqual(msg);
    });

    it('trims content', () => {
      const msg = { role: 'assistant', content: '  Hi there  ' };
      expect(ChatMessageSchema.parse(msg).content).toBe('Hi there');
    });

    it('rejects empty content', () => {
      const msg = { role: 'user', content: '   ' };
      expect(() => ChatMessageSchema.parse(msg)).toThrow();
    });

    it('rejects content exceeding limit', () => {
      const msg = { role: 'user', content: 'a'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1) };
      expect(() => ChatMessageSchema.parse(msg)).toThrow();
    });
  });

  describe('pruneMessages', () => {
    it('does nothing to a short list of short messages', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi' },
      ];
      expect(pruneMessages(messages)).toEqual(messages);
    });

    it('limits individual message length', () => {
      const longContent = 'a'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 100);
      const messages: ChatMessage[] = [{ role: 'user', content: longContent }];
      const pruned = pruneMessages(messages);
      expect(pruned[0].content).toHaveLength(MAX_MESSAGE_CONTENT_LENGTH);
    });

    it('removes messages that become empty after trimming', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: '   ' },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toBe('Hello');
    });

    it('keeps only the last MAX_MESSAGES', () => {
      const messages: ChatMessage[] = Array.from({ length: MAX_MESSAGES + 5 }, (_, i) => ({
        role: 'user',
        content: `Message ${i}`,
      }));
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(MAX_MESSAGES);
      expect(pruned[0].content).toBe('Message 5');
      expect(pruned[MAX_MESSAGES - 1].content).toBe(`Message ${MAX_MESSAGES + 4}`);
    });

    it('prunes based on total content length, keeping most recent', () => {
      // Each message is within MAX_MESSAGE_CONTENT_LENGTH (500)
      // Total content (7 * 500 = 3500) exceeds MAX_TOTAL_CONTENT_LENGTH (3000)
      const messages: ChatMessage[] = Array.from({ length: 7 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: String.fromCharCode(65 + i).repeat(500),
      }));

      const pruned = pruneMessages(messages);
      // It should remove the oldest message (index 0) to get to 3000
      expect(pruned).toHaveLength(6);
      expect(pruned[0].content).toBe('B'.repeat(500));
      expect(pruned[5].content).toBe('G'.repeat(500));
    });

    it('does not prune the very last message even if it exceeds total limit (if it is alone)', () => {
      // Though ChatMessageSchema would reject this if it exceeded MAX_MESSAGE_CONTENT_LENGTH (500)
      // and MAX_TOTAL_CONTENT_LENGTH is 3000.
      // So a single message can't actually exceed MAX_TOTAL_CONTENT_LENGTH if it passes schema.
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_MESSAGE_CONTENT_LENGTH) },
      ];
      expect(pruneMessages(messages)).toHaveLength(1);
    });
  });

  describe('ChatRequestSchema', () => {
    it('validates a valid request', () => {
      const req = {
        messages: [{ role: 'user', content: 'Hello' }],
      };
      expect(ChatRequestSchema.parse(req)).toEqual(req);
    });

    it('rejects more than MAX_MESSAGES', () => {
      const req = {
        messages: Array.from({ length: MAX_MESSAGES + 1 }, () => ({
          role: 'user',
          content: 'Hi',
        })),
      };
      expect(() => ChatRequestSchema.parse(req)).toThrow();
    });

    it('rejects more than MAX_TOTAL_CONTENT_LENGTH', () => {
      const req = {
        messages: [
          { role: 'user', content: 'a'.repeat(500) },
          { role: 'assistant', content: 'b'.repeat(500) },
          { role: 'user', content: 'c'.repeat(500) },
          { role: 'assistant', content: 'd'.repeat(500) },
          { role: 'user', content: 'e'.repeat(500) },
          { role: 'assistant', content: 'f'.repeat(501) }, // This one is too long for single message anyway
        ],
      };
      expect(() => ChatRequestSchema.parse(req)).toThrow();
    });

    it('rejects total length exceeding limit with valid individual messages', () => {
      const req = {
        messages: Array.from({ length: 10 }, () => ({
          role: 'user',
          content: 'a'.repeat(301), // 10 * 301 = 3010 > 3000
        })),
      };
      expect(() => ChatRequestSchema.parse(req)).toThrow();
    });
  });
});
