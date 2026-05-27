import type { APIRoute } from 'astro';

const MAX_MESSAGES = 10;
const MAX_MESSAGE_CONTENT_LENGTH = 500;
const MAX_TOTAL_CONTENT_LENGTH = 3000;
const RATE_LIMIT_THRESHOLD = 20;
const RATE_LIMIT_TTL = 3600;
const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const jsonHeaders = { 'content-type': 'application/json' };

const SYSTEM_PROMPT = `You are Alexander Härenstam, a strategic Product Leader at IFS.
You are based in Nacka/Stockholm.
Your tone is professional, insightful, and empathetic.
You have a background in Software Engineering and Innovation Management.
Keep your responses brief, typically 2-3 sentences.`;

export const prerender = false;

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateMessages(messages: unknown): ChatMessage[] | Response {
  if (!Array.isArray(messages)) {
    return jsonError('Expected messages to be an array', 400);
  }

  if (messages.length === 0) {
    return jsonError('Expected at least one message', 400);
  }

  if (messages.length > MAX_MESSAGES) {
    return jsonError(`Message history cannot exceed ${MAX_MESSAGES} messages`, 400);
  }

  let totalContentLength = 0;

  const validatedMessages: ChatMessage[] = [];

  for (const [index, message] of messages.entries()) {
    if (!isRecord(message)) {
      return jsonError(`Message at index ${index} must be an object`, 400);
    }

    const { role, content } = message;

    if (role !== 'user' && role !== 'assistant') {
      return jsonError(`Message at index ${index} has an unsupported role`, 400);
    }

    if (typeof content !== 'string') {
      return jsonError(`Message at index ${index} content must be a string`, 400);
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
      return jsonError(`Message at index ${index} content cannot be empty`, 400);
    }

    if (trimmedContent.length > MAX_MESSAGE_CONTENT_LENGTH) {
      return jsonError(
        `Message at index ${index} cannot exceed ${MAX_MESSAGE_CONTENT_LENGTH} characters`,
        400
      );
    }

    totalContentLength += trimmedContent.length;

    if (totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
      return jsonError(
        `Message history cannot exceed ${MAX_TOTAL_CONTENT_LENGTH} total characters`,
        400
      );
    }

    validatedMessages.push({ role, content: trimmedContent });
  }

  return validatedMessages;
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Access bindings through locals.runtime.env or process.env (fallback for non-Cloudflare)
  const bindings = ((locals as unknown as { runtime?: { env: ChatEnv } }).runtime?.env ||
    process.env) as unknown as ChatEnv;

  const ai = bindings.AI;
  const store = bindings.CHAT_STORE;

  if (!ai) {
    return jsonError('AI binding not found. Chat is only available on Cloudflare Workers.', 503);
  }

  // Basic Security: Client IP-based rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `chat-limit:${ip}`;

  if (store) {
    const currentCount = parseInt((await store.get(rateLimitKey)) || '0');
    if (currentCount >= RATE_LIMIT_THRESHOLD) {
      return jsonError('Rate limit exceeded. Try again in an hour.', 429);
    }
    await store.put(rateLimitKey, (currentCount + 1).toString(), { expirationTtl: RATE_LIMIT_TTL });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON payload', 400);
  }

  if (!isRecord(body)) {
    return jsonError('Expected request body to be an object', 400);
  }

  const { messages } = body;
  const validatedMessages = validateMessages(messages);

  if (validatedMessages instanceof Response) {
    return validatedMessages;
  }

  try {
    const stream = await ai.run(DEFAULT_MODEL, {
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...validatedMessages],
      stream: true,
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return jsonError(errorMessage, 500);
  }
};
