import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const files = [
  'src/pages/about.astro',
  'src/pages/biography.astro',
  'src/components/MainHead.astro',
  'public/llms.txt',
  'src/pages/api/chat.ts',
];

describe('identity copy', () => {
  const sources = files.map((path) => ({ path, text: readFileSync(path, 'utf8') }));

  it('does not use Strategic Product Leader in about, biography, meta, llms.txt, or the twin prompt', () => {
    for (const { path, text } of sources) {
      expect(text, path).not.toContain('Strategic Product Leader');
    }
  });

  it('uses Product Manager, Developer Experience as the title', () => {
    for (const { path, text } of sources) {
      expect(text, path).toContain('Product Manager, Developer Experience');
    }
  });

  it('does not mint unverifiable About metrics', () => {
    const about = sources.find((s) => s.path.endsWith('about.astro'))!.text;
    expect(about).not.toContain('multi-million');
    expect(about).not.toContain('autonomous industrial AI');
    expect(about).toContain('2x faster delivery');
    expect(about).toContain('30x ROI');
    expect(about).toContain('Zeroheight');
  });

  it('grounds llms.txt with Chalmers education and recruiter keywords', () => {
    const llms = sources.find((s) => s.path.endsWith('llms.txt'))!.text;
    expect(llms).toContain('Chalmers B.Sc. Software Engineering');
    expect(llms).toContain('Management and Economics of Innovation');
    expect(llms).toContain('Greater Stockholm');
    expect(llms).toContain('AI coding copilots');
    expect(llms).toContain('IFS Cloud');
  });
});
