import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const ai = locals.runtime?.env?.AI;
  const store = locals.runtime?.env?.CHAT_STORE;

  if (!ai) {
    return new Response(JSON.stringify({ error: 'AI binding not found' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Basic Security: Client IP-based rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `chat-limit:${ip}`;
  let currentCount = 0;

  if (store) {
    currentCount = parseInt((await store.get(rateLimitKey)) || '0');
    if (currentCount >= 20) {
      // 20 requests per hour limit
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in an hour.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  try {
    const body = await request.json();
    const { messages } = body;

    // Validation: Check message size and count
    if (!Array.isArray(messages) || messages.length > 10) {
      return new Response(JSON.stringify({ error: 'Invalid message history' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const lastMessage = messages[messages.length - 1]?.content;
    if (typeof lastMessage !== 'string' || lastMessage.length > 500) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Increment rate limit counter only after validation
    if (store) {
      await store.put(rateLimitKey, (currentCount + 1).toString(), { expirationTtl: 3600 });
    }

    const systemPrompt = `You are Alexander Härenstam, a strategic Product Leader at IFS.
You are based in Nacka/Stockholm.
Your tone is professional, insightful, and empathetic.
You have a background in Software Engineering and Innovation Management.
Keep your responses brief, typically 2-3 sentences.`;

    const stream = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
      },
    });
  } catch (e: unknown) {
    console.error('Chat API Error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
