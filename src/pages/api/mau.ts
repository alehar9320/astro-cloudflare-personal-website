import type { APIRoute } from 'astro';
import { fetchMAU, MAUApiResponseSchema } from '../../utils/posthog-mau';

// API route for fetching Monthly Active Users (MAU)
export const prerender = false;

const CACHE_CONTROL_HEADER = 'public, max-age=3600'; // Cache for 1 hour

/**
 * API route to fetch Monthly Active Users (MAU) from PostHog.
 */
export const GET: APIRoute = async ({ locals }) => {
  // Access bindings through locals.runtime.env (Cloudflare Workers runtime)
  const env = (locals as unknown as { runtime?: { env?: { fetch?: typeof fetch } } }).runtime?.env;

  // Use Cloudflare's fetch if available, otherwise fallback to global fetch
  const fetchImpl = env?.fetch || fetch;

  try {
    const mau = await fetchMAU(fetchImpl, env);
    const timestamp = new Date().toISOString();

    // Validate the response structure before returning
    const validatedResponse = MAUApiResponseSchema.safeParse({ mau, timestamp });

    if (!validatedResponse.success) {
      console.error('MAU API: Response validation failed:', validatedResponse.error.format());
      // Return a generic error if our own schema validation fails
      return new Response(JSON.stringify({ error: 'Failed to format MAU data' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(validatedResponse.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('MAU API route error:', errorMessage);

    // Return a default MAU value on any error during fetch
    return new Response(JSON.stringify({ error: 'Failed to retrieve MAU data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
