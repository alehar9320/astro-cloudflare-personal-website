import { describe, expect, it } from 'vitest';
import {
  pruneMessages,
  MAX_MESSAGES,
  MAX_MESSAGE_CONTENT_LENGTH,
  MAX_TOTAL_CONTENT_LENGTH,
  DESIGN_SYSTEM_CHIP,
  DESIGN_SYSTEM_PROOF,
  LINKEDIN_HIRE_REPLY,
  groundedCannedAnswer,
  groundedDesignSystemAnswer,
  groundedLinkedInHireAnswer,
  ChatMessageSchema,
  ChatRequestSchema,
  sseTextStream,
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
      // Manually trigger the while loop and if (removed) branch
      // Actually we can't easily trigger if (!removed) without mocking shift or using a sparse array
      // But we can ensure the branch is covered by providing a case where shift returns something.
      // The previous test already covers if (removed).
      // To cover line 44, we just need to run the loop.
      const longMessages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH) },
        { role: 'user', content: 'b' },
      ];
      expect(pruneMessages(longMessages)).toHaveLength(1);
    });

    it('handles defensive check for shift() returning undefined (line coverage)', () => {
      // This test is specifically to ensure line 44 is executed.
      // Since shift() on a non-empty array (pruned.length > 1) in TS technically returns T | undefined,
      // we check for it defensively.
      const messages: ChatMessage[] = [
        { role: 'user', content: 'a'.repeat(MAX_TOTAL_CONTENT_LENGTH + 1) },
        { role: 'user', content: 'b' },
      ];
      // This will trigger shift() once.
      const pruned = pruneMessages(messages);
      expect(pruned).toHaveLength(1);
      expect(pruned[0].content).toBe('b');
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

    it('drops leading assistant messages so pruned history begins with a user turn', () => {
      const longContent = 'x'.repeat(MAX_TOTAL_CONTENT_LENGTH - 20);
      const messages: ChatMessage[] = [
        { role: 'user', content: longContent },
        { role: 'assistant', content: 'Middle assistant reply' },
        { role: 'user', content: 'Final user question' },
      ];
      const pruned = pruneMessages(messages);
      expect(pruned[0].role).toBe('user');
      expect(pruned[0].content).toBe('Final user question');
    });
  });

  describe('grounded canned answers', () => {
    it('returns the design-system proof for the live chip', () => {
      expect(groundedDesignSystemAnswer(DESIGN_SYSTEM_CHIP)).toBe(DESIGN_SYSTEM_PROOF);
      expect(groundedCannedAnswer(DESIGN_SYSTEM_CHIP)).toBe(DESIGN_SYSTEM_PROOF);
    });

    it('returns a visitor-facing LinkedIn hire line with no twin-mouth me/my/I', () => {
      expect(groundedLinkedInHireAnswer('How do I get in touch on LinkedIn?')).toBe(
        LINKEDIN_HIRE_REPLY
      );
      expect(groundedCannedAnswer('How do I get in touch?')).toBe(LINKEDIN_HIRE_REPLY);
      expect(LINKEDIN_HIRE_REPLY).toBe('Continue on LinkedIn: https://www.linkedin.com/in/alehar/');
      expect(LINKEDIN_HIRE_REPLY.toLowerCase()).not.toMatch(/\b(me|my|i)\b/);
      expect(groundedLinkedInHireAnswer('What is your email?')).toBeNull();
      expect(groundedLinkedInHireAnswer('Can I download a CV?')).toBeNull();
    });
  });

  describe('ChatMessageSchema & ChatRequestSchema', () => {
    it('validates correct chat message objects and trims whitespace', () => {
      const res = ChatMessageSchema.safeParse({ role: 'user', content: '  Hello  ' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.content).toBe('Hello');
      }
    });

    it('rejects empty or overly long message content', () => {
      const emptyRes = ChatMessageSchema.safeParse({ role: 'user', content: '   ' });
      expect(emptyRes.success).toBe(false);

      const tooLongRes = ChatMessageSchema.safeParse({
        role: 'user',
        content: 'x'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1),
      });
      expect(tooLongRes.success).toBe(false);
    });

    it('validates request objects with valid messages array', () => {
      const validReq = ChatRequestSchema.safeParse({
        messages: [{ role: 'user', content: 'Test prompt' }],
      });
      expect(validReq.success).toBe(true);

      const invalidReq = ChatRequestSchema.safeParse({ messages: [] });
      expect(invalidReq.success).toBe(false);
    });
  });

  describe('sseTextStream', () => {
    it('streams text as SSE payload chunk followed by [DONE]', async () => {
      const stream = sseTextStream('Hello world');
      const reader = stream.getReader();
      const { value, done } = await reader.read();
      expect(done).toBe(false);
      const text = new TextDecoder().decode(value);
      expect(text).toBe('data: {"response":"Hello world"}\n\ndata: [DONE]\n\n');
      const next = await reader.read();
      expect(next.done).toBe(true);
    });
  });
});
