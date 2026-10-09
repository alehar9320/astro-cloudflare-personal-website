import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// context/ is a public, agent-facing corpus. It must never carry logged-in
// LinkedIn UI (owner-only "Open to work" roles, "Private to you" boxes) or the
// unapproved copilots value claim.
const banned = ['open to work', 'private to you', 'several millions'];

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

describe('context/ privacy', () => {
  const files = listFiles('context');

  it('has files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s has no logged-in LinkedIn UI or unapproved claims', (path) => {
    const text = readFileSync(path, 'utf8').toLowerCase();
    for (const phrase of banned) {
      expect(text, `${path} contains "${phrase}"`).not.toContain(phrase);
    }
  });
});
