import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { LATEST_RELEASE_SNAPSHOT } from '../../data/latest-release';
import { fetchGitHubReleases, type SiteRelease } from '../../utils/github-releases';
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

export const prerender = false;

export interface ReleaseSummaryEnv {
  AI?: {
    run: (model: string, input: unknown) => Promise<unknown>;
  };
  CHAT_STORE?: KVNamespace;
  GITHUB_TOKEN?: string;
}

function readEnv(): ReleaseSummaryEnv {
  try {
    if (env && typeof env === 'object') return env as ReleaseSummaryEnv;
  } catch {
    // cloudflare:workers env is the only binding surface after adapter v13.
  }
  return {};
}

function jsonBody(tag: string, summary: string) {
  return new Response(JSON.stringify({ tag, summary }), { headers: jsonHeaders });
}

function postedRelease(data: unknown): SiteRelease | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as {
    tag?: unknown;
    version?: unknown;
    title?: unknown;
    body?: unknown;
    notes?: unknown;
  };
  const version =
    typeof row.tag === 'string' ? row.tag : typeof row.version === 'string' ? row.version : '';
  const body =
    typeof row.body === 'string' ? row.body : typeof row.notes === 'string' ? row.notes : '';
  const title = typeof row.title === 'string' && row.title.trim() ? row.title : version;
  if (!version.trim()) return null;
  return {
    body,
    publishedAt: null,
    title,
    url: LATEST_RELEASE_SNAPSHOT.url,
    version: version.trim(),
  };
}

async function summarize(request: Request) {
  try {
    const bindings = readEnv();
    let latest: SiteRelease | null = null;
    let source = 'github';

    if (request.method === 'POST') {
      try {
        latest = postedRelease(await request.json());
        if (latest) source = 'post';
        else {
          console.error({
            event: 'release_summary_204',
            reason: 'method',
            method: 'POST',
            detail: 'missing_tag',
          });
        }
      } catch (error: unknown) {
        console.error({
          event: 'release_summary_204',
          reason: 'method',
          method: 'POST',
          error: String(error),
        });
      }
    }

    if (!latest) {
      const token = bindings.GITHUB_TOKEN?.trim();
      const releases = await fetchGitHubReleases(fetch, undefined, token ? { token } : undefined);
      latest = releases[0] ?? null;
      if (latest) source = 'github';
    }

    if (!latest) {
      latest = LATEST_RELEASE_SNAPSHOT;
      source = 'snapshot';
      console.error({
        event: 'release_summary_github_empty',
        reason: 'tag_miss',
        using: 'snapshot',
      });
    }

    const notes = `${latest.version}\n${latest.body}`;
    const key = releaseSummaryKey(latest.version);
    const store = bindings.CHAT_STORE;

    if (store) {
      const cached = await store.get(key);
      const preparedCache = cached ? prepareReleaseSummary(cached, notes) : null;
      if (preparedCache) {
        return jsonBody(latest.version, preparedCache);
      }
    }

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
        const summary = prepareReleaseSummary(parseModelText(result), notes);
        if (summary) {
          if (store) await store.put(key, summary);
          return jsonBody(latest.version, summary);
        }
        console.error({
          event: 'release_summary_sanitizer',
          reason: 'sanitizer',
          tag: latest.version,
          source,
        });
      } catch (error: unknown) {
        console.error({
          event: 'release_summary_ai_error',
          error: String(error),
          tag: latest.version,
        });
      }
    }

    const fallback = groundedReleaseSummary(latest.version, latest.body, latest.title);
    if (store) await store.put(key, fallback);
    return jsonBody(latest.version, fallback);
  } catch (error: unknown) {
    console.error({ event: 'release_summary_204', reason: 'error', error: String(error) });
    const fallback = groundedReleaseSummary(
      LATEST_RELEASE_SNAPSHOT.version,
      LATEST_RELEASE_SNAPSHOT.body,
      LATEST_RELEASE_SNAPSHOT.title
    );
    return jsonBody(LATEST_RELEASE_SNAPSHOT.version, fallback);
  }
}

export const GET: APIRoute = async ({ request }) => summarize(request);

export const POST: APIRoute = async ({ request }) => summarize(request);
