import { z } from 'zod';

export const MAX_MESSAGES = 10;
export const MAX_MESSAGE_CONTENT_LENGTH = 500;
export const MAX_TOTAL_CONTENT_LENGTH = 3000;

export const ChatRoleSchema = z.enum(['user', 'assistant']);
export type ChatRole = z.infer<typeof ChatRoleSchema>;

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
    .max(MAX_MESSAGES, `Message history cannot exceed ${MAX_MESSAGES} messages`)
    .refine(
      (msgs) => msgs.reduce((acc, msg) => acc + msg.content.length, 0) <= MAX_TOTAL_CONTENT_LENGTH,
      `Message history cannot exceed ${MAX_TOTAL_CONTENT_LENGTH} total characters`
    ),
});

/**
 * Prunes a list of messages to ensure they fit within the defined limits
 * using a sliding window approach (keeping the most recent messages).
 */
export function pruneMessages(messages: ChatMessage[]): ChatMessage[] {
  // 1. Ensure each individual message is within its length limit
  let pruned = messages.map((msg) => ({
    ...msg,
    content: msg.content.trim().slice(0, MAX_MESSAGE_CONTENT_LENGTH),
  }));

  // 2. Remove any messages that became empty after trimming/slicing
  pruned = pruned.filter((msg) => msg.content.length > 0);

  // 3. Limit the number of messages to MAX_MESSAGES (keep most recent)
  if (pruned.length > MAX_MESSAGES) {
    pruned = pruned.slice(-MAX_MESSAGES);
  }

  // 4. Limit the total content length to MAX_TOTAL_CONTENT_LENGTH (keep most recent)
  let totalLength = pruned.reduce((acc, msg) => acc + msg.content.length, 0);
  while (totalLength > MAX_TOTAL_CONTENT_LENGTH && pruned.length > 1) {
    // biome-ignore lint/style/noNonNullAssertion: safe due to pruned.length > 1
    const removed = pruned.shift()!;
    totalLength -= removed.content.length;
  }

  return pruned;
}
