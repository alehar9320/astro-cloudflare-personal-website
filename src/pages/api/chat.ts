import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { ChatRequestSchema, pruneMessages, type ChatMessage } from '../../utils/chat-logic';
import llmsTxt from '../../../public/llms.txt?raw';

const jsonHeaders = {
  'content-type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
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

function readChatEnv(): ChatEnv {
  try {
    if (env && typeof env === 'object') return env as ChatEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

const UNAVAILABLE = 'Chat is currently unavailable. Please try again later.';

export const POST: APIRoute = async ({ request }) => {
  let bindings: ChatEnv;
  try {
    bindings = readChatEnv();
  } catch {
    return jsonError(UNAVAILABLE, 503);
  }

  const ai = bindings.AI;
  const store = bindings.CHAT_STORE;

  if (!ai) {
    return jsonError(UNAVAILABLE, 503);
  }

  // Basic Security: Client IP-based rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `chat-limit:${ip}`;

  if (store) {
    const rawCount = await store.get(rateLimitKey);
    // biome-ignore lint/style/noNonNullAssertion: rate limit check is inside store guard
    let currentCount = parseInt(rawCount || '0');
    if (Number.isNaN(currentCount)) {
      currentCount = 0;
    }

    if (currentCount >= 20) {
      // 20 requests per hour limit
      return jsonError('Rate limit exceeded. Try again in an hour.', 429);
    }
    // Increment counter with 1 hour expiration
    await store.put(rateLimitKey, (currentCount + 1).toString(), { expirationTtl: 3600 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error: unknown) {
    console.error({ event: 'chat_api_json_parse_error', error: String(error) });
    return jsonError(
      'We couldn’t process your request. Please check your message and try again.',
      400
    );
  }

  const result = ChatRequestSchema.safeParse(body);

  if (!result.success) {
    // Sanitize issues for telemetry to prevent data leaks (redact 'received' and 'value')
    const sanitizedIssues = result.error.issues.map((issue) => {
      const safeIssue = { ...issue } as Record<string, unknown>;
      delete safeIssue.received;
      delete safeIssue.value;
      return safeIssue;
    });
    console.warn({ event: 'chat_api_validation_failed', issues: sanitizedIssues });

    // Return the first validation error message for simplicity and security (don't leak schema details)
    return jsonError(result.error.issues[0].message, 400);
  }

  const prunedMessages = pruneMessages(result.data.messages as ChatMessage[]);

  const systemPrompt = `You are Alexander Härenstam's digital twin. Speak in the first person as his twin.
Current title: Product Manager, Developer Experience at IFS (Feb 2025-present, Greater Stockholm).
Education: Chalmers B.Sc. Software Engineering; Chalmers M.Sc. Management and Economics of Innovation. Eight years at IFS.
The IFS Design System case is the only numbered proof (2x faster delivery, 30x ROI, Zeroheight runner-up). Do not mint new ROI.
AI coding copilots is current DevEx work with no numbered proof.
Hire path is LinkedIn only: https://www.linkedin.com/in/alehar/. Do not invent email, a résumé, or availability. Do not tell the UI to add a Get in touch button.
Recruiter keywords (not a fake title): Product Management, Developer Experience, DevEx, AI coding copilots, design systems, Industrial AI, IFS Cloud, platform, product strategy.
Keep answers brief (2-3 sentences). If asked something not in this prompt or the listed pages, say it is not on this site.

${llmsTxt}`;

  try {
    const stream = await ai.run('@cf/meta/llama-3.1-8b-instruct-fast', {
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
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
      },
    });
  } catch (error: unknown) {
    console.error({ event: 'chat_api_run_error', error: String(error) });
    // Defense in Depth: Never expose raw error messages to the UI for server-side failures
    return jsonError('An internal error occurred. Please try again later.', 500);
  }
};
