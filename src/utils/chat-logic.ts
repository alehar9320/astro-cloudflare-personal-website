import { z } from 'zod';

/** Maximum number of messages allowed in a single chat conversation. */
export const MAX_MESSAGES = 10;
/** Maximum character length for a single message's content. */
export const MAX_MESSAGE_CONTENT_LENGTH = 500;
/** Maximum total character length for all messages in a conversation. */
export const MAX_TOTAL_CONTENT_LENGTH = 3000;

/** Zod schema for valid chat roles. */
export const ChatRoleSchema = z.enum(['user', 'assistant']);

/** Zod schema for a single chat message, enforcing content length and trimming. */
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

/** TypeScript type for a chat message, inferred from ChatMessageSchema. */
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/** Zod schema for chat API requests, requiring at least one message. */
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
  const pruned = messages.slice(-MAX_MESSAGES);
  let totalLength = pruned.reduce((acc, msg) => acc + msg.content.length, 0);

  while (pruned.length > 1 && totalLength > MAX_TOTAL_CONTENT_LENGTH) {
    // biome-ignore lint/style/noNonNullAssertion: loop guard ensures shift() returns an element
    totalLength -= pruned.shift()!.content.length;
  }

  return pruned;
}
