import type { APIRoute } from 'astro';
import { ChatRequestSchema, pruneMessages } from '../../utils/chat-logic';

const jsonHeaders = {
  'content-type': 'application/json',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const;

export const prerender = false;

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
    return jsonError('AI binding not found. Chat is only available on Cloudflare Workers.', 503);
  }

  // Basic Security: Client IP-based rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `chat-limit:${ip}`;

  if (store) {
    const currentCount = parseInt((await store.get(rateLimitKey)) || '0');
    const safeCount = Number.isNaN(currentCount) ? 0 : currentCount;

    if (safeCount >= 20) {
      // 20 requests per hour limit
      return jsonError('Rate limit exceeded. Try again in an hour.', 429);
    }
    // Increment counter with 1 hour expiration
    await store.put(rateLimitKey, (safeCount + 1).toString(), { expirationTtl: 3600 });
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
    // Return the first validation error message for simplicity and security (don't leak schema details)
    return jsonError(result.error.issues[0].message, 400);
  }

  const { messages } = result.data;
  const prunedMessages = pruneMessages(messages);

  const systemPrompt = `You are Alexander Härenstam, a strategic Product Leader at IFS.
You are based in Nacka/Stockholm.
Your tone is professional, insightful, and empathetic.
You have a background in Software Engineering and Innovation Management.
Keep your responses brief, typically 2-3 sentences.`;

  try {
    const stream = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'system', content: systemPrompt }, ...prunedMessages],
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
