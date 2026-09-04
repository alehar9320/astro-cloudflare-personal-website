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
  const windowed = messages.slice(-MAX_MESSAGES);
  if (windowed.length <= 1) return windowed;

  let start = 0;
  let totalLength = windowed.reduce((acc, msg) => acc + msg.content.length, 0);

  while (start < windowed.length - 1 && totalLength > MAX_TOTAL_CONTENT_LENGTH) {
    totalLength -= windowed[start].content.length;
    start += 1;
  }

  while (start < windowed.length - 1 && windowed[start].role === 'assistant') {
    totalLength -= windowed[start].content.length;
    start += 1;
  }

  return start > 0 ? windowed.slice(start) : windowed;
}

export const DESIGN_SYSTEM_CHIP = 'What did the IFS Design System change?';

export const DESIGN_SYSTEM_PROOF =
  'The IFS Design System delivered up to 2x faster delivery and up to 30x ROI, and was a Zeroheight runner-up.';

export function groundedDesignSystemAnswer(lastUserMessage: string): string | null {
  const question = lastUserMessage.trim().toLowerCase();
  if (
    question === DESIGN_SYSTEM_CHIP.toLowerCase() ||
    (question.includes('design system') &&
      (question.includes('ifs') || question.includes('change') || question.includes('roi')))
  ) {
    return DESIGN_SYSTEM_PROOF;
  }
  return null;
}

/** Visitor-facing hire line — no twin-mouth me/my/I. Card still carries the primary. */
export const LINKEDIN_HIRE_REPLY = 'Continue on LinkedIn: https://www.linkedin.com/in/alehar/';

export function groundedLinkedInHireAnswer(lastUserMessage: string): string | null {
  const question = lastUserMessage.trim().toLowerCase();
  if (!question) return null;
  // Email / CV stay off the twin — no public email, no placeholder CV.
  if (
    question.includes('email') ||
    question.includes('cv') ||
    question.includes('résumé') ||
    question.includes('resume')
  ) {
    return null;
  }
  if (
    question.includes('linkedin') ||
    question.includes('get in touch') ||
    question.includes('hire') ||
    /\bcontact\b/.test(question)
  ) {
    return LINKEDIN_HIRE_REPLY;
  }
  return null;
}

export function groundedCannedAnswer(lastUserMessage: string): string | null {
  return groundedDesignSystemAnswer(lastUserMessage) ?? groundedLinkedInHireAnswer(lastUserMessage);
}

export function sseTextStream(text: string): ReadableStream<Uint8Array> {
  const body = `data: ${JSON.stringify({ response: text })}\n\ndata: [DONE]\n\n`;
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(body));
      controller.close();
    },
  });
}
