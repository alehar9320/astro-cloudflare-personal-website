import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { fetchGitHubReleases } from '../../utils/github-releases';
import {
  groundedReleaseSummary,
  parseModelText,
  prepareReleaseSummary,
  RELEASE_SUMMARY_MODEL,
  releaseSummaryKey,
  releaseSummaryPrompt,
} from '../../utils/release-summary';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
} as const;

const jsonHeaders = {
  'content-type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  ...securityHeaders,
} as const;

const emptyHeaders = {
  'Cache-Control': 'no-store',
  ...securityHeaders,
} as const;

export const prerender = false;

export interface ReleaseSummaryEnv {
  AI?: {
    run: (model: string, input: unknown) => Promise<unknown>;
  };
  CHAT_STORE?: KVNamespace;
}

function empty204() {
  return new Response(null, { status: 204, headers: emptyHeaders });
}

function readEnv(): ReleaseSummaryEnv {
  try {
    if (env && typeof env === 'object') return env as ReleaseSummaryEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

export const GET: APIRoute = async () => {
  try {
    const bindings = readEnv();
    const releases = await fetchGitHubReleases();
    const latest = releases[0];
    if (!latest) return empty204();

    const source = `${latest.version}\n${latest.body}`;
    const key = releaseSummaryKey(latest.version);
    const store = bindings.CHAT_STORE;

    if (store) {
      const cached = await store.get(key);
      const preparedCache = cached ? prepareReleaseSummary(cached, source) : null;
      if (preparedCache) {
        return new Response(JSON.stringify({ tag: latest.version, summary: preparedCache }), {
          headers: jsonHeaders,
        });
      }
    }

    const json = (summary: string) =>
      new Response(JSON.stringify({ tag: latest.version, summary }), { headers: jsonHeaders });

    const ai = bindings.AI;
    if (ai) {
      try {
        const result = await ai.run(RELEASE_SUMMARY_MODEL, {
          messages: [
            {
              role: 'user',
              content: releaseSummaryPrompt(latest.version, latest.body),
            },
          ],
          stream: false,
        });
        const summary = prepareReleaseSummary(parseModelText(result), source);
        if (summary) {
          if (store) await store.put(key, summary);
          return json(summary);
        }
      } catch (error: unknown) {
        console.error({ event: 'release_summary_ai_error', error: String(error) });
      }
    }

    const fallback = groundedReleaseSummary(latest.version, latest.body, latest.title);
    if (!fallback) return empty204();
    if (store) await store.put(key, fallback);
    return json(fallback);
  } catch (error: unknown) {
    console.error({ event: 'release_summary_error', error: String(error) });
    return empty204();
  }
};
