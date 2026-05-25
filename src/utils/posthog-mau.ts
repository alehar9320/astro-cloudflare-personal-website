import { z } from 'zod';

// PostHog Query API response schema (HogQLQuery result)
// The API returns rows as an array of arrays: [[1234]]
const PostHogQueryResultsSchema = z.object({
  columns: z.array(z.string()),
  results: z.array(z.array(z.unknown())),
});

export const PostHogQueryResponseSchema = z.object({
  error: z.boolean().optional(),
  results: z.union([PostHogQueryResultsSchema, z.array(z.unknown())]),
});

export type PostHogQueryResponse = z.infer<typeof PostHogQueryResponseSchema>;

// Our own API response schema
export const MAUApiResponseSchema = z.object({
  mau: z.number().int().nonnegative(),
  timestamp: z.string(),
});

export type MAUApiResponse = z.infer<typeof MAUApiResponseSchema>;

const DEFAULT_MAU = 0;

/**
 * Fetches the current Monthly Active Users count from PostHog.
 * Uses the PostHog Query API with a HogQL query.
 * Returns 0 on any error (fail-open — the footer must never break).
 */
export async function fetchMAU(fetchImpl: typeof fetch = fetch): Promise<number> {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.PUBLIC_POSTHOG_PROJECT_ID;
  const posthogHost = process.env.PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

  if (!apiKey || !projectId) {
    console.warn('PostHog MAU: missing API key or project ID');
    return DEFAULT_MAU;
  }

  // Defensive: only allow trusted PostHog domains
  const allowedHosts = [
    'eu.i.posthog.com',
    'us.i.posthog.com',
    'app.posthog.com',
    'eu.posthog.com',
    'us.posthog.com',
  ];
  try {
    const hostUrl = new URL(posthogHost);
    if (!allowedHosts.includes(hostUrl.hostname)) {
      console.error('PostHog MAU: untrusted host', hostUrl.hostname);
      return DEFAULT_MAU;
    }
  } catch {
    console.error('PostHog MAU: invalid host URL');
    return DEFAULT_MAU;
  }

  const queryUrl = `${posthogHost.replace(/\/$/, '')}/api/projects/${projectId}/query/`;

  const queryBody = {
    query: {
      kind: 'HogQLQuery',
      query:
        'SELECT count(distinct person_id) as mau FROM events WHERE timestamp >= now() - INTERVAL 30 DAY',
    },
  };

  try {
    const response = await fetchImpl(queryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(queryBody),
    });

    if (!response.ok) {
      console.error('PostHog MAU: API request failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return DEFAULT_MAU;
    }

    const json: unknown = await response.json();
    const result = PostHogQueryResponseSchema.safeParse(json);

    if (!result.success) {
      console.error('PostHog MAU: response validation failed:', result.error.format());
      return DEFAULT_MAU;
    }

    const data = result.data;

    if (data.error) {
      console.error('PostHog MAU: API returned an error');
      return DEFAULT_MAU;
    }

    // Extract the MAU count from the results
    // The query returns a single row with a single column: [[1234]]
    if (
      'results' in data &&
      data.results !== null &&
      typeof data.results === 'object' &&
      'results' in data.results &&
      Array.isArray(data.results.results) &&
      data.results.results.length > 0 &&
      Array.isArray(data.results.results[0]) &&
      data.results.results[0].length > 0
    ) {
      const mauValue = data.results.results[0][0];
      const parsed = Number(mauValue);
      if (Number.isFinite(parsed) && parsed >= 0) {
        return Math.floor(parsed);
      }
    }

    // Fallback: if results is a plain array (some API versions return differently)
    if (Array.isArray(data.results) && data.results.length > 0) {
      const firstRow = data.results[0];
      if (Array.isArray(firstRow) && firstRow.length > 0) {
        const mauValue = firstRow[0];
        const parsed = Number(mauValue);
        if (Number.isFinite(parsed) && parsed >= 0) {
          return Math.floor(parsed);
        }
      }
    }

    console.warn('PostHog MAU: could not extract MAU count from response');
    return DEFAULT_MAU;
  } catch (error) {
    const safeErrorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('PostHog MAU: request errored:', safeErrorMessage);
    return DEFAULT_MAU;
  }
}
