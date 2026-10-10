// Build-time snapshot of GitHub releases for /whats-new/ (#1579).
// The Worker falls back to this file when its own GitHub fetch fails and the isolate has no
// last good list yet (the Cache API is a no-op on *.workers.dev). Fail-soft: a failed fetch
// keeps any existing snapshot, warns loudly on stderr and never fails the build. Never logs the
// token. Runs inside `npm run build` (not a prebuild hook) so it can't be skipped silently.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const URL_ =
  'https://api.github.com/repos/alehar9320/astro-cloudflare-personal-website/releases?per_page=20';
const OUT = fileURLToPath(new URL('../src/data/releases-snapshot.generated.json', import.meta.url));
const FIELDS = ['body', 'draft', 'html_url', 'name', 'prerelease', 'published_at', 'tag_name'];

const token = process.env.GITHUB_TOKEN?.trim();
try {
  const response = await fetch(URL_, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'alehar9320-astro-cloudflare-personal-website',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  if (!Array.isArray(json) || json.length === 0) throw new Error('no releases');
  const slim = json.map((release) =>
    Object.fromEntries(FIELDS.filter((key) => key in release).map((key) => [key, release[key]]))
  );
  writeFileSync(OUT, `${JSON.stringify(slim, null, 2)}\n`);
  console.log(`releases snapshot: ${slim.length} releases`);
} catch (error) {
  // Loud on purpose (#1668): a skipped snapshot builds green but leaves cold isolates with no
  // What's New fallback. Still never exits non-zero, so a GitHub rate limit can't block a deploy.
  const reason = String(error).replace(/token\s+\S+/g, 'token [REDACTED]');
  console.error(
    [
      '',
      '==================================================================',
      `WARN releases snapshot SKIPPED: ${reason} — /whats-new/ will rely on live fetch + isolate memory`,
      "WARN The cold-start What's New fallback (BUILD_SNAPSHOT) will be empty or stale for this deploy.",
      '==================================================================',
      '',
    ].join('\n')
  );
}
