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

interface ReleaseItem {
  hash?: string;
  message: string;
  url?: string;
}

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

export async function fetchGitHubReleases(
  fetchImpl: typeof fetch = fetch,
  url: string = RELEASES_API_URL
): Promise<SiteRelease[]> {
  const githubToken = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;

  // Defensive check to ensure we only fetch from the trusted GitHub API domain
  if (!url.startsWith('https://api.github.com/')) {
    console.error('Invalid GitHub API URL');
    return [];
  }

  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
      },
    });

    if (!response.ok) {
      // Intentionally avoiding logging headers that might contain sensitive information
      console.error('GitHub releases request failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const json = await response.json();
    const result = z.array(GitHubReleaseApiItemSchema).safeParse(json);

    if (!result.success) {
      console.error('GitHub releases API validation failed:', result.error.issues);
      return [];
    }

    const releases = result.data;

    return releases
      .filter((release) => !release.prerelease)
      .map(normalizeRelease)
      .filter((release): release is SiteRelease => release !== null);
  } catch (error) {
    // Redact potential token if error message contains it (defense in depth)
    const safeErrorMessage =
      error instanceof Error
        ? error.message.replace(/token\s+[a-zA-Z0-9_-]+/g, 'token [REDACTED]')
        : 'Unknown error';
    console.error('GitHub releases request errored:', safeErrorMessage);
    return [];
  }
}

export function formatReleaseDate(dateString: string | null): string {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toISOString().split('T')[0];
}

export function parseReleaseItem(line: string): ReleaseItem {
  const cleaned = line.trim();
  // Matches a 7-character hex hash at the beginning
  const hashMatch = cleaned.match(/^([a-f0-9]{7})\s+(.*)/);

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

export function splitReleaseBody(body: string): ReleaseItem[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*+]\s+/.test(line))
    .map((line) => line.replace(/^[-*+]\s+/, ''))
    .map(parseReleaseItem);
}

export { RELEASES_PAGE_URL };
