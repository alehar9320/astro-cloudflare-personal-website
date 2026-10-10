import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SCRIPT = 'scripts/snapshot-releases.mjs';

function runWithFetch(stub: string) {
  return spawnSync(
    process.execPath,
    [`--import=data:text/javascript,${encodeURIComponent(stub)}`, SCRIPT],
    {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: 'ghp_secretvalue123' },
      timeout: 20_000,
    }
  );
}

describe('build runs the What’s New releases snapshot (#1668)', () => {
  it('runs the snapshot script inside build, before astro build, with no prebuild hook', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string | undefined>;
    };
    expect(pkg.scripts.build).toBe('node scripts/snapshot-releases.mjs && astro build');
    expect(pkg.scripts.build?.startsWith('node scripts/snapshot-releases.mjs && ')).toBe(true);
    expect(pkg.scripts.build).toContain('astro build');
    expect(pkg.scripts.prebuild).toBeUndefined();
  });

  it('never exits non-zero, keeps the success line and warns SKIPPED', () => {
    const script = readFileSync(SCRIPT, 'utf8');
    expect(script).not.toMatch(/process\.exit\(\s*[1-9]/);
    expect(script).not.toMatch(/process\.exitCode\s*=\s*[1-9]/);
    expect(script).toContain('console.log(`releases snapshot: ${slim.length} releases`);');
    expect(script).toContain('SKIPPED');
  });

  it.each([
    ['a rejected fetch', "globalThis.fetch = () => Promise.reject(new Error('rate limited'));"],
    ['a 403 rate limit', "globalThis.fetch = async () => new Response('{}', { status: 403 });"],
  ])('exits 0 and warns loudly on stderr after %s', (_, stub) => {
    const run = runWithFetch(stub);
    expect(run.status).toBe(0);
    expect(run.stderr).toContain('WARN releases snapshot SKIPPED:');
    expect(run.stderr).toContain('/whats-new/ will rely on live fetch + isolate memory');
    expect(run.stderr).toContain('will be empty for this deploy');
    expect(run.stdout).not.toContain('releases snapshot: ');
    expect(`${run.stdout}${run.stderr}`).not.toContain('ghp_secretvalue123');
  });

  it('redacts a token that appears in the error text', () => {
    const run = runWithFetch(
      "globalThis.fetch = () => Promise.reject(new Error('bad header token ghp_secretvalue123'));"
    );
    expect(run.status).toBe(0);
    expect(run.stderr).toContain('token [REDACTED]');
    expect(run.stderr).not.toContain('ghp_secretvalue123');
  });
});
