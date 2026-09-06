import { z } from 'zod';

export const GitHubReleaseApiItemSchema = z.object({
  body: z.string().nullable().optional(),
  draft: z.boolean().optional(),
  html_url: z.string().optional(),
  name: z.string().nullable().optional(),
  prerelease: z.boolean().optional(),
  published_at: z.string().nullable().optional(),
  tag_name: z.string().optional(),
});

export type GitHubReleaseApiItem = z.infer<typeof GitHubReleaseApiItemSchema>;

export const SiteReleaseSchema = z.object({
  body: z.string(),
  publishedAt: z.string().nullable(),
  title: z.string(),
  url: z.string(),
  version: z.string(),
});

export type SiteRelease = z.infer<typeof SiteReleaseSchema>;

const RELEASES_API_URL =
  'https://api.github.com/repos/alehar9320/astro-cloudflare-personal-website/releases?per_page=20';
const RELEASES_PAGE_URL =
  'https://github.com/alehar9320/astro-cloudflare-personal-website/releases';
const REPO_URL = 'https://github.com/alehar9320/astro-cloudflare-personal-website';
function logReleaseValidationFailed(issues: z.ZodError['issues']): void {
  const sanitizedIssues = issues.map((issue) => {
    const safeIssue = { ...issue } as Record<string, unknown>;
    delete safeIssue.received;
    delete safeIssue.value;
    return safeIssue;
  });
  console.error({
    event: 'github_releases_validation_failed',
    issues: sanitizedIssues,
  });
}

/**
 * Represents a single item within a release's changelog.
 */
interface ReleaseItem {
  /** The 7-character git commit hash, if available. */
  hash?: string;
  /** The descriptive message of the change. */
  message: string;
  /** The absolute URL to the GitHub commit page. */
  url?: string;
}

/**
 * Normalizes a GitHub API release item into a structured SiteRelease object.
 * @param {GitHubReleaseApiItem} release - The raw release data from the GitHub API.
 * @returns {SiteRelease | null} A formatted site release, or null if the release is a draft or missing a tag.
 */
export function normalizeRelease(release: GitHubReleaseApiItem): SiteRelease | null {
  if (!release.tag_name || release.draft) return null;

  return {
    body: (release.body || '').trim(),
    publishedAt: release.published_at || null,
    title: release.name?.trim() || release.tag_name,
    url: release.html_url || RELEASES_PAGE_URL,
    version: release.tag_name,
  };
}

export interface FetchReleasesOptions {
  /** Optional GitHub API token from the Worker API route. Never log this. */
  token?: string;
}

/**
 * Fetches and validates a list of non-prerelease items from the GitHub Releases API.
 * @param {typeof fetch} [fetchImpl=fetch] - The fetch implementation to use (useful for testing).
 * @param {string} [url=RELEASES_API_URL] - The GitHub API endpoint to fetch from.
 * @param {FetchReleasesOptions} [options] - Optional token from the API route.
 * @returns {Promise<SiteRelease[]>} A promise resolving to an array of normalized site releases.
 */
export async function fetchGitHubReleases(
  fetchImpl: typeof fetch = fetch,
  url: string = RELEASES_API_URL,
  options?: FetchReleasesOptions
): Promise<SiteRelease[]> {
  if (typeof window !== 'undefined' && url === RELEASES_API_URL) {
    // Same-origin /api/releases is cheap. Skip sessionStorage so a new GitHub
    // release is not hidden behind a 1-hour stale list (exec 1814 / list 1720).
    try {
      const response = await fetchImpl('/api/releases', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const json = await response.json();
        const parsed = z.array(SiteReleaseSchema).safeParse(json);
        if (parsed.success && parsed.data.length > 0) {
          return parsed.data;
        }
        if (!parsed.success) {
          logReleaseValidationFailed(parsed.error.issues);
        }
      }
    } catch (error: unknown) {
      console.error({ event: 'github_releases_proxy_error', error: String(error) });
    }

    return [];
  }

  const githubToken = options?.token?.trim() || undefined;

  // Defensive check to ensure we only fetch from the trusted GitHub API domain
  if (!url.startsWith('https://api.github.com/')) {
    console.error({ event: 'github_releases_invalid_url', url });
    return [];
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
    };
    if (typeof window === 'undefined') {
      headers['User-Agent'] = 'alehar9320-astro-cloudflare-personal-website';
      headers['X-GitHub-Api-Version'] = '2022-11-28';
    }

    const response = await fetchImpl(url, { headers });

    if (!response.ok) {
      // Intentionally avoiding logging headers that might contain sensitive information
      console.error({
        event: 'github_releases_request_failed',
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const json = await response.json();
    const result = z.array(GitHubReleaseApiItemSchema).safeParse(json);

    if (!result.success) {
      logReleaseValidationFailed(result.error.issues);
      return [];
    }

    const releases = result.data
      .filter((release) => !release.prerelease)
      .map(normalizeRelease)
      .filter((release): release is SiteRelease => release !== null);

    return releases;
  } catch (error) {
    // Redact potential token if error message contains it (defense in depth)
    const safeErrorMessage = String(error).replace(/token\s+[a-zA-Z0-9_-]+/g, 'token [REDACTED]');
    console.error({ event: 'github_releases_request_error', error: safeErrorMessage });
    return [];
  }
}

/**
 * Formats an ISO date string into a YYYY-MM-DD format.
 * @param {string | null} dateString - The raw date string from the API.
 * @returns {string} The formatted date, or 'Unknown date' if invalid.
 */
export function formatReleaseDate(dateString: string | null): string {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toISOString().split('T')[0];
}

/**
 * Parses a single changelog line into a ReleaseItem, extracting hashes and messages.
 * @param {string} line - A single line from the release body.
 * @returns {ReleaseItem} An object containing the message and optional commit metadata.
 */
export function parseReleaseItem(line: string): ReleaseItem {
  const cleaned = line.trim();
  // Matches a 7 to 40-character hex hash at the beginning
  const hashMatch = cleaned.match(/^([a-f0-9]{7,40})\s+(.*)/i);

  if (hashMatch) {
    const hash = hashMatch[1];
    return {
      hash,
      message: hashMatch[2],
      url: `${REPO_URL}/commit/${hash}`,
    };
  }

  return {
    message: cleaned,
  };
}

const INTERNAL_CHANGELOG_ITEM = /\bjules\b|\bagent[- ]farm\b|\bjohan nits\b/i;

export function isPublicChangelogItem(item: ReleaseItem): boolean {
  return !INTERNAL_CHANGELOG_ITEM.test(item.message);
}

/**
 * Splits a release body into individual, formatted ReleaseItem objects.
 * Filters for lines starting with list markers (-, *, +).
 * Drops Jules, agent-farm, and Johan-nits internals from the public list.
 * Single-pass implementation to minimize allocations on edge runtimes.
 * @param {string} body - The full Markdown body of a GitHub release.
 * @returns {ReleaseItem[]} An array of parsed release items.
 */
export function splitReleaseBody(body: string): ReleaseItem[] {
  const lines = body.split('\n');
  const items: ReleaseItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!/^[-*+]\s+/.test(trimmed)) continue;

    const rawMessage = trimmed.replace(/^[-*+]\s+/, '');
    const item = parseReleaseItem(rawMessage);
    if (isPublicChangelogItem(item)) {
      items.push(item);
    }
  }

  return items;
}

export { RELEASES_PAGE_URL };
