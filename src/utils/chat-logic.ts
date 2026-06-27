import { z } from 'zod';

export const MAX_MESSAGES = 10;
export const MAX_MESSAGE_CONTENT_LENGTH = 500;
export const MAX_TOTAL_CONTENT_LENGTH = 3000;

export const ChatRoleSchema = z.enum(['user', 'assistant']);

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z
    .string()
    .trim()
    .min(1, 'Message content cannot be empty')
    .max(
      MAX_MESSAGE_CONTENT_LENGTH,
      `Message cannot exceed ${MAX_MESSAGE_CONTENT_LENGTH} characters`
    ),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, 'Expected at least one message')
    .refine((msgs) => msgs.length === 0 || msgs[msgs.length - 1].role === 'user', {
      message: 'The last message must be from the user',
    }),
});

/**
 * Prunes conversation history to fit within defined message and character limits.
 * Implements a sliding window algorithm that prioritizes the most recent messages.
 * Enforces a strict protocol where the sequence must always start with a 'user' message.
 *
 * @param messages - The history of chat messages.
 * @returns A pruned array of messages that satisfies all constraints.
 */
export function pruneMessages(messages: ChatMessage[]): ChatMessage[] {
  // Ensure we always start with a user message to maintain conversational cadence
  const firstUserIndex = messages.findIndex((m) => m.role === 'user');
  if (firstUserIndex === -1) return [];

  const pruned = messages.slice(firstUserIndex).slice(-MAX_MESSAGES);

  // Re-verify that the slice still starts with a user message after sliding window
  while (pruned.length > 0 && pruned[0].role !== 'user') {
    pruned.shift();
  }

  let totalLength = pruned.reduce((acc, msg) => acc + msg.content.length, 0);

  while (pruned.length > 1 && totalLength > MAX_TOTAL_CONTENT_LENGTH) {
    // biome-ignore lint/style/noNonNullAssertion: loop guard ensures shift() returns an element
    totalLength -= pruned.shift()!.content.length;

    // After shifting, ensure the sequence still starts with 'user'
    while (pruned.length > 0 && pruned[0].role !== 'user') {
      // biome-ignore lint/style/noNonNullAssertion: loop guard ensures shift() returns an element
      totalLength -= pruned.shift()!.content.length;
    }
  }

  return pruned;
}
