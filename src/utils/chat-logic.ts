import { z } from 'zod';

/** Maximum number of messages to keep in the conversation history. */
export const MAX_MESSAGES = 10;
/** Maximum character length allowed for a single message. */
export const MAX_MESSAGE_CONTENT_LENGTH = 500;
/** Maximum total character length allowed across all messages in a request. */
export const MAX_TOTAL_CONTENT_LENGTH = 3000;

/** Schema for valid chat participant roles. */
export const ChatRoleSchema = z.enum(['user', 'assistant']);

/** Schema for a single chat message, enforcing content length and role. */
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

/** Schema for chat requests, requiring at least one message. */
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
