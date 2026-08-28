import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  ChatRequestSchema,
  groundedCannedAnswer,
  pruneMessages,
  sseTextStream,
  type ChatMessage,
} from '../../utils/chat-logic';
import llmsTxt from '../../../public/llms.txt?raw';

const jsonHeaders = {
  'content-type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

const sseHeaders = {
  'content-type': 'text/event-stream',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

export const prerender = false;

export const HOURLY_LIMIT = 20;
export const DAILY_LIMIT = 500;

export interface ChatEnv {
  AI?: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
  CHAT_STORE?: KVNamespace;
}

function remainingHeaders(hourlyRemaining: number, dailyRemaining: number) {
  return {
    'X-Chat-Hourly-Limit': String(HOURLY_LIMIT),
    'X-Chat-Hourly-Remaining': String(Math.max(0, hourlyRemaining)),
    'X-Chat-Daily-Limit': String(DAILY_LIMIT),
    'X-Chat-Daily-Remaining': String(Math.max(0, dailyRemaining)),
  };
}

function jsonError(error: string, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
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

function parseCount(raw: string | null): number {
  const parsed = parseInt(raw || '0', 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function utcDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function nextUtcMidnightUnix(now = new Date()): number {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0) / 1000
  );
}

function dailyPutOptions(now = new Date()): { expiration: number } | { expirationTtl: number } {
  const expiration = nextUtcMidnightUnix(now);
  const secondsUntilMidnight = expiration - Math.floor(now.getTime() / 1000);
  if (secondsUntilMidnight >= 60) {
    return { expiration };
  }
  return { expirationTtl: 86400 };
}

const UNAVAILABLE = 'Chat is currently unavailable. Please try again later.';

const systemPrompt = `You are Alexander Härenstam's digital twin. Speak in the first person as his twin.
Current title: Product Manager, Developer Experience at IFS (Feb 2025-present, Greater Stockholm).
Education: Chalmers B.Sc. Software Engineering; Chalmers M.Sc. Management and Economics of Innovation. Eight years at IFS.
When asked about the IFS Design System, answer with this exact proof: up to 2x faster delivery, up to 30x ROI, Zeroheight runner-up.
Write the digits 2 and 30. Say up to twice as fast (up to 2x) and up to thirty times ROI (up to 30x). Never say "x faster" or "x ROI". Do not mint new ROI.
AI coding copilots is current DevEx work. Do not invent copilots metrics.
Hire path is LinkedIn only: https://www.linkedin.com/in/alehar/. Do not invent email, a résumé, or availability. Do not tell the UI to add a Get in touch button.
When the visitor asks about hire, contact, LinkedIn, or getting in touch: answer in visitor-facing voice with no first-person me/my/I. Prefer exactly: Continue on LinkedIn: https://www.linkedin.com/in/alehar/. Do not say find me, from me, my LinkedIn, or I. The UI may show a LinkedIn confirm card.
Recruiter keywords (not a fake title): Product Management, Developer Experience, DevEx, AI coding copilots, design systems, Industrial AI, IFS Cloud, platform, product strategy.
Keep answers brief (2-3 sentences). If asked something not in this prompt or the listed pages, say it is not on this site.

${llmsTxt}`;

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

  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const hourlyKey = `chat-hourly:${ip}`;
  const dailyKey = `chat-daily:${utcDateKey()}`;

  let hourlyCount = 0;
  let dailyCount = 0;

  if (store) {
    const [hourlyRaw, dailyRaw] = await Promise.all([store.get(hourlyKey), store.get(dailyKey)]);
    hourlyCount = parseCount(hourlyRaw);
    dailyCount = parseCount(dailyRaw);

    if (hourlyCount >= HOURLY_LIMIT) {
      return jsonError(
        'Rate limit exceeded. Try again in an hour.',
        429,
        remainingHeaders(0, DAILY_LIMIT - dailyCount)
      );
    }

    if (dailyCount >= DAILY_LIMIT) {
      return jsonError(
        'Site-wide daily chat limit reached. Try again tomorrow.',
        429,
        remainingHeaders(HOURLY_LIMIT - hourlyCount, 0)
      );
    }
  }

  const prunedMessages = pruneMessages(result.data.messages as ChatMessage[]);
  const lastUser = [...prunedMessages].reverse().find((message) => message.role === 'user');
  const canned = lastUser ? groundedCannedAnswer(lastUser.content) : null;

  try {
    const stream = canned
      ? sseTextStream(canned)
      : await ai.run('@cf/meta/llama-3.1-8b-instruct-fast', {
          messages: [{ role: 'system', content: systemPrompt }, ...prunedMessages],
          stream: true,
        });

    if (store) {
      hourlyCount += 1;
      dailyCount += 1;
      await Promise.all([
        store.put(hourlyKey, hourlyCount.toString(), { expirationTtl: 3600 }),
        store.put(dailyKey, dailyCount.toString(), dailyPutOptions()),
      ]);
    }

    return new Response(stream, {
      headers: {
        ...sseHeaders,
        ...remainingHeaders(
          store ? HOURLY_LIMIT - hourlyCount : HOURLY_LIMIT,
          store ? DAILY_LIMIT - dailyCount : DAILY_LIMIT
        ),
      },
    });
  } catch (error: unknown) {
    console.error({ event: 'chat_api_run_error', error: String(error) });
    // Defense in Depth: Never expose raw error messages to the UI for server-side failures
    return jsonError(
      'An internal error occurred. Please try again later.',
      500,
      store ? remainingHeaders(HOURLY_LIMIT - hourlyCount, DAILY_LIMIT - dailyCount) : {}
    );
  }
};
