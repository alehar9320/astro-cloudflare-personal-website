import { z } from 'zod';

export const MAX_MESSAGES = 10;
export const MAX_MESSAGE_CONTENT_LENGTH = 500;
export const MAX_TOTAL_CONTENT_LENGTH = 3000;

export const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

export const SYSTEM_PROMPT = `You are Alexander Härenstam, a strategic Product Leader at IFS.
You are based in Nacka/Stockholm.
Your tone is professional, insightful, and empathetic.
You have a background in Software Engineering and Innovation Management.
Keep your responses brief, typically 2-3 sentences.`;

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
  const pruned = messages.slice(-MAX_MESSAGES);
  let totalLength = pruned.reduce((acc, msg) => acc + msg.content.length, 0);

  while (pruned.length > 1 && totalLength > MAX_TOTAL_CONTENT_LENGTH) {
    // biome-ignore lint/style/noNonNullAssertion: loop guard ensures shift() returns an element
    totalLength -= pruned.shift()!.content.length;
  }

  // Optimization: Ensure the conversation history starts with a 'user' message if multiple messages exist.
  // This helps provide a deterministic starting point for the LLM context.
  while (pruned.length > 1 && pruned[0].role !== 'user') {
    pruned.shift();
  }

  return pruned;
}
