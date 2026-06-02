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

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export interface ChatEnv {
  AI?: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
  CHAT_STORE?: KVNamespace;
}

/**
 * Normalizes a message by handling legacy roles and trimming content.
 */
export function normalizeMessage(message: { role: string; content: string }): ChatMessage {
  const role = message.role === 'ai' ? 'assistant' : message.role;
  const content = message.content.trim().slice(0, MAX_MESSAGE_CONTENT_LENGTH);

  return {
    role: ChatRoleSchema.catch('user').parse(role),
    content: content || '...', // Ensure non-empty
  };
}

/**
 * Prunes a message history to fit within API constraints.
 * Uses a sliding window to keep the most recent messages.
 */
export function pruneMessages(messages: ChatMessage[]): ChatMessage[] {
  let pruned = [...messages];

  // 1. Enforce max message count
  if (pruned.length > MAX_MESSAGES) {
    pruned = pruned.slice(-MAX_MESSAGES);
  }

  // 2. Enforce total character limit
  while (
    pruned.length > 0 &&
    pruned.reduce((acc, msg) => acc + msg.content.length, 0) > MAX_TOTAL_CONTENT_LENGTH
  ) {
    pruned.shift();
  }

  // Ensure we have at least one message if the input was not empty
  if (messages.length > 0 && pruned.length === 0) {
    const last = messages[messages.length - 1];
    pruned = [
      {
        ...last,
        content: last.content.slice(0, MAX_TOTAL_CONTENT_LENGTH),
      },
    ];
  }

  return pruned;
}
