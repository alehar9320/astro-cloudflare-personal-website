import type { APIRoute } from 'astro';
import { z } from 'zod';

const MAX_MESSAGES = 10;
const MAX_MESSAGE_CONTENT_LENGTH = 500;
const MAX_TOTAL_CONTENT_LENGTH = 3000;

const jsonHeaders = {
  'content-type': 'application/json',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const;

export const prerender = false;

const ChatRoleSchema = z.enum(['user', 'assistant']);

const ChatMessageSchema = z.object({
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

const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, 'Expected at least one message')
    .max(MAX_MESSAGES, `Message history cannot exceed ${MAX_MESSAGES} messages`)
    .refine(
      (msgs) => msgs.reduce((acc, msg) => acc + msg.content.length, 0) <= MAX_TOTAL_CONTENT_LENGTH,
      `Message history cannot exceed ${MAX_TOTAL_CONTENT_LENGTH} total characters`
    ),
});

export interface ChatEnv {
  AI?: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
  CHAT_STORE?: KVNamespace;
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: jsonHeaders,
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Access bindings through locals.runtime.env or process.env (fallback for non-Cloudflare)
  const bindings = ((locals as unknown as { runtime?: { env: ChatEnv } }).runtime?.env ||
    process.env) as unknown as ChatEnv;

  const ai = bindings.AI;
  const store = bindings.CHAT_STORE;

  if (!ai) {
    console.error({ event: 'chat_api_missing_ai_binding' });
    return jsonError('AI binding not found. Chat is only available on Cloudflare Workers.', 503);
  }

  // Basic Security: Client IP-based rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `chat-limit:${ip}`;

  if (store) {
    try {
      const currentCount = parseInt((await store.get(rateLimitKey)) || '0');
      if (currentCount >= 20) {
        // 20 requests per hour limit
        return jsonError('Rate limit exceeded. Try again in an hour.', 429);
      }
      // Increment counter with 1 hour expiration
      await store.put(rateLimitKey, (currentCount + 1).toString(), { expirationTtl: 3600 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : String(e);
      console.error({ event: 'chat_api_storage_error', error });
      throw e;
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    console.error({ event: 'chat_api_json_parse_error', error });
    return jsonError('Invalid JSON payload', 400);
  }

  const result = ChatRequestSchema.safeParse(body);

  if (!result.success) {
    console.error({
      event: 'chat_api_validation_failed',
      // Redact potentially sensitive input data from issues by removing 'received' and 'value' fields
      issues: result.error.issues.map((issue) => {
        const { received: _r, value: _v, ...safeIssue } = issue as any;
        return safeIssue;
      }),
    });
    // Return the first validation error message for simplicity and security (don't leak schema details)
    return jsonError(result.error.issues[0].message, 400);
  }

  const { messages } = result.data;

  const systemPrompt = `You are Alexander Härenstam, a strategic Product Leader at IFS.
You are based in Nacka/Stockholm.
Your tone is professional, insightful, and empathetic.
You have a background in Software Engineering and Innovation Management.
Keep your responses brief, typically 2-3 sentences.`;

  try {
    const stream = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error({ event: 'chat_api_run_error', error: errorMessage });
    // Defense in Depth: Never expose raw error messages to the UI for server-side failures
    return jsonError('An internal error occurred. Please try again later.', 500);
  }
};
