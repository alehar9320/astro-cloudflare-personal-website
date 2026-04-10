export interface GitHubReleaseApiItem {
  body?: string | null;
  draft?: boolean;
  html_url?: string;
  name?: string | null;
  prerelease?: boolean;
  published_at?: string | null;
  tag_name?: string;
}

export interface SiteRelease {
  body: string;
  publishedAt: string | null;
  title: string;
  url: string;
  version: string;
}

const RELEASES_API_URL =
  'https://api.github.com/repos/alehar9320/astro-cloudflare-personal-website/releases?per_page=20';
const RELEASES_PAGE_URL =
  'https://github.com/alehar9320/astro-cloudflare-personal-website/releases';
const REPO_URL = 'https://github.com/alehar9320/astro-cloudflare-personal-website';

export interface ReleaseItem {
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

export async function fetchGitHubReleases(fetchImpl: typeof fetch = fetch): Promise<SiteRelease[]> {
  const githubToken = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;

  try {
    const response = await fetchImpl(RELEASES_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
      },
    });

    if (!response.ok) {
      console.error('GitHub releases request failed', {
        rateLimitLimit: response.headers.get('x-ratelimit-limit'),
        rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
        rateLimitReset: response.headers.get('x-ratelimit-reset'),
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const releases = (await response.json()) as GitHubReleaseApiItem[];

    return releases
      .filter((release) => !release.prerelease)
      .map(normalizeRelease)
      .filter((release): release is SiteRelease => release !== null);
  } catch (error) {
    console.error('GitHub releases request errored', error);
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
  const cleaned = line.trim().replace(/^- /, '');
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
    .filter(Boolean)
    .map(parseReleaseItem);
}

export { RELEASES_PAGE_URL, REPO_URL };
