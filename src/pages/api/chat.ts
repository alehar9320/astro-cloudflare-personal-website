import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const { messages } = await request.json();

  const ai = locals.runtime?.env?.AI;

  if (!ai) {
    return new Response(JSON.stringify({ error: 'AI binding not found' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

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
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
