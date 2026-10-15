import { describe, it, expect } from 'vitest';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  ADAPTED_HARNESSES,
  REF,
  copySkills,
  patchPlatformAdaptation,
} from '../scripts/vendor-superpowers.mjs';

const skillsDir = path.resolve(process.cwd(), '.agents', 'skills');
const bootstrapPath = path.join(skillsDir, 'using-superpowers', 'SKILL.md');

describe('superpowers vendoring', () => {
  it('pins an explicit upstream ref', () => {
    expect(REF).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it('ships the bootstrap skill and every adapted harness reference', () => {
    expect(existsSync(bootstrapPath)).toBe(true);
    for (const { reference } of ADAPTED_HARNESSES) {
      expect(existsSync(path.join(skillsDir, 'using-superpowers', reference))).toBe(true);
    }
  });

  it('lists every adapted harness in the Platform Adaptation section', () => {
    const content = readFileSync(bootstrapPath, 'utf8');
    for (const { label, reference } of ADAPTED_HARNESSES) {
      expect(content).toContain(`- ${label}: \`${reference}\``);
    }
  });

  it('gives each vendored skill frontmatter with a name and description', () => {
    const entries = [
      'brainstorming',
      'systematic-debugging',
      'test-driven-development',
      'using-superpowers',
      'writing-plans',
    ];
    for (const entry of entries) {
      const content = readFileSync(path.join(skillsDir, entry, 'SKILL.md'), 'utf8');
      expect(content).toMatch(/^---\n[\s\S]*?name:/m);
      expect(content).toMatch(/description:/);
    }
  });
});

describe('patchPlatformAdaptation', () => {
  const upstream = [
    '## Platform Adaptation',
    '',
    'If your harness appears here, read its reference file:',
    '',
    '- Claude Code: `references/claude-code-tools.md`',
    '- Muse: `references/muse-tools.md`',
    '',
  ].join('\n');

  it('inserts missing harness pointers after the anchor', () => {
    const patched = patchPlatformAdaptation(upstream);
    for (const { label, reference } of ADAPTED_HARNESSES) {
      expect(patched).toContain(`- ${label}: \`${reference}\``);
    }
    expect(patched.indexOf('Muse')).toBeLessThan(patched.indexOf('OpenCode'));
  });

  it('is idempotent', () => {
    const once = patchPlatformAdaptation(upstream);
    expect(patchPlatformAdaptation(once)).toBe(once);
  });
});

describe('copySkills', () => {
  it('copies a tree and preserves executable modes', () => {
    const work = mkdtempSync(path.join(tmpdir(), 'sp-copy-'));
    try {
      const src = path.join(work, 'src');
      const dest = path.join(work, 'dest');
      mkdirSync(path.join(src, 'using-superpowers'), { recursive: true });
      writeFileSync(path.join(src, 'using-superpowers', 'SKILL.md'), '---\nname: x\n---\nbody\n');
      mkdirSync(path.join(src, 'tool', 'scripts'), { recursive: true });
      const script = path.join(src, 'tool', 'scripts', 'run');
      writeFileSync(script, '#!/bin/sh\necho hi\n', { mode: 0o755 });

      copySkills(src, dest);

      expect(existsSync(path.join(dest, 'using-superpowers', 'SKILL.md'))).toBe(true);
      expect(readFileSync(path.join(dest, 'tool', 'scripts', 'run'), 'utf8')).toBe(
        '#!/bin/sh\necho hi\n'
      );
      if (process.platform !== 'win32') {
        expect(statSync(path.join(dest, 'tool', 'scripts', 'run')).mode & 0o111).not.toBe(0);
      }
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  });

  it('throws when the bootstrap skill is absent upstream', () => {
    const work = mkdtempSync(path.join(tmpdir(), 'sp-copy-'));
    try {
      expect(() => copySkills(work, path.join(work, 'dest'))).toThrow(/using-superpowers/);
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  });
});
