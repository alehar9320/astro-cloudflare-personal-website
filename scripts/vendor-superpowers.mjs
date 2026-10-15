// Vendors the upstream Superpowers skills (github.com/obra/superpowers) into the
// repo so every harness (opencode, pi, Grok Build, Google Jules) can discover them
// from the shared `.agents/skills` directory, with no runtime dependencies and no
// network access at build time.
//
// The vendored skills are pinned to a tag and kept verbatim; the only local edit is
// the Platform Adaptation pointer list in `using-superpowers/SKILL.md`, which we
// re-apply idempotently so a re-vendor never drops the repo's harnesses.
//
// Usage: npm run vendor:superpowers  (or: node scripts/vendor-superpowers.mjs)
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const UPSTREAM_URL = 'https://github.com/obra/superpowers.git';
// Pinned upstream release. Bump deliberately, then re-run the vendor script.
export const REF = 'v7.0.0';

const UPSTREAM_SKILLS_SUBDIR = 'skills';

// Resolve the destination from the current working directory. npm scripts and
// `node scripts/vendor-superpowers.mjs` both run from the repo root.
export function destDir() {
  return join(process.cwd(), '.agents', 'skills');
}

// Harnesses this repo adapts Superpowers to. `using-superpowers/SKILL.md` must
// point readers at each one so the model loads the right tool-mapping reference.
export const ADAPTED_HARNESSES = [
  { label: 'OpenCode', reference: 'references/opencode-tools.md' },
  { label: 'Grok Build', reference: 'references/grok-tools.md' },
  { label: 'Google Jules', reference: 'references/jules-tools.md' },
];

const PLATFORM_ANCHOR = '- Muse: `references/muse-tools.md`';
const BOOTSTRAP_SKILL = join('using-superpowers', 'SKILL.md');

// Ensure `using-superpowers/SKILL.md` lists every adapted harness exactly once,
// right after the last upstream entry. Idempotent: re-running is a no-op.
export function patchPlatformAdaptation(content) {
  const lines = content.split('\n');
  const missing = ADAPTED_HARNESSES.filter(({ label }) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return !lines.some((line) => new RegExp(`^-\\s*${escaped}:`).test(line));
  });
  if (missing.length === 0) return content;

  const anchorIndex = lines.findIndex((line) => line.trim() === PLATFORM_ANCHOR);
  const insertAt = anchorIndex === -1 ? lines.length : anchorIndex + 1;
  const additions = missing.map(({ label, reference }) => `- ${label}: \`${reference}\``);
  lines.splice(insertAt, 0, ...additions);
  return lines.join('\n');
}

// Recursively copy one directory over another, preserving file modes so the
// executable helpers in the vendored skills stay executable.
export function copySkills(sourceDir, destDir) {
  if (!existsSync(join(sourceDir, BOOTSTRAP_SKILL))) {
    throw new Error(`Upstream skills tree is missing ${BOOTSTRAP_SKILL}`);
  }
  cpSync(sourceDir, destDir, { recursive: true, force: true, preserveTimestamps: true });
}

function cloneUpstream(ref, into) {
  execFileSync('git', ['clone', '--depth', '1', '--branch', ref, UPSTREAM_URL, into], {
    stdio: 'inherit',
  });
}

function main() {
  const workdir = mkdtempSync(join(tmpdir(), 'superpowers-'));
  const checkout = join(workdir, 'superpowers');
  const dest = destDir();
  try {
    console.log(`Vendoring superpowers ${REF} into ${dest}`);
    cloneUpstream(REF, checkout);
    copySkills(join(checkout, UPSTREAM_SKILLS_SUBDIR), dest);

    const bootstrapPath = join(dest, BOOTSTRAP_SKILL);
    const patched = patchPlatformAdaptation(readFileSync(bootstrapPath, 'utf8'));
    writeFileSync(bootstrapPath, patched);

    for (const { reference } of ADAPTED_HARNESSES) {
      const refPath = join(dest, 'using-superpowers', reference);
      if (!existsSync(refPath)) {
        throw new Error(`Expected harness reference to exist: ${refPath}`);
      }
    }
    console.log(`Vendored ${REF}. Platform adaptation patched for adapted harnesses.`);
  } catch (error) {
    console.error(`Vendor failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
