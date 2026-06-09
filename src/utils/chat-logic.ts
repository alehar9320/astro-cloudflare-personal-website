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
  // Relaxed constraints: pruneMessages will handle the sliding window to fit model limits.
  messages: z.array(ChatMessageSchema).min(1, 'Expected at least one message'),
});

/**
 * Prunes conversation history to fit within defined message and character limits.
 * Implements a sliding window algorithm that prioritizes the most recent messages.
 *
 * @param messages - The history of chat messages.
 * @returns A pruned array of messages that satisfies all constraints.
 */
export function pruneMessages(messages: ChatMessage[]): ChatMessage[] {
  // 1. Limit by message count (sliding window)
  const pruned = messages.slice(-MAX_MESSAGES);

  // 2. Limit by total character count (sliding window)
  let totalLength = pruned.reduce((acc, msg) => acc + msg.content.length, 0);

  while (totalLength > MAX_TOTAL_CONTENT_LENGTH && pruned.length > 1) {
    const removed = pruned.shift();
    if (removed) {
      totalLength -= removed.content.length;
    }
  }

  return pruned;
}
