import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const files = [
  'src/pages/about.astro',
  'src/pages/biography.astro',
  'src/pages/work.astro',
  'src/components/MainHead.astro',
  'public/llms.txt',
  'src/pages/api/chat.ts',
];

describe('identity copy', () => {
  const sources = files.map((path) => ({ path, text: readFileSync(path, 'utf8') }));

  it('does not use Strategic Product Leader in about, biography, meta, llms.txt, or the twin prompt', () => {
    for (const { path, text } of sources) {
      expect(text.toLowerCase(), path).not.toContain('strategic product leader');
      expect(text.toLowerCase(), path).not.toContain('strategic product leadership');
    }
  });

  it('uses Product Manager, Developer Experience as the title', () => {
    for (const { path, text } of sources) {
      expect(text, path).toContain('Product Manager, Developer Experience');
    }
  });

  it('does not mint unverifiable metrics on About, Work, or the twin', () => {
    const about = sources.find((s) => s.path.endsWith('about.astro'))!.text;
    const work = sources.find((s) => s.path.endsWith('work.astro'))!.text;
    const twin = sources.find((s) => s.path.endsWith('chat.ts'))!.text;
    for (const { path, text } of sources) {
      expect(text, path).not.toContain('multi-million');
      expect(text, path).not.toContain('several millions');
      expect(text, path).not.toContain('Strategic Product Management');
    }
    expect(about).not.toContain('autonomous industrial AI');
    expect(about).not.toContain('30x ROI');
    expect(about).toContain('/work/ifs-design-system/');
    expect(work).toContain('Product Manager, Developer Experience');
    const bio = sources.find((s) => s.path.endsWith('biography.astro'))!.text;
    expect(bio).toContain(
      'Explore the professional journey of Alexander Härenstam, Product Manager, Developer Experience at IFS.'
    );
    expect(twin).toContain('2x faster delivery');
    expect(twin).toContain('30x ROI');
  });

  it('keeps spaces around TL;DR strong terms (Astro drops newline-only spaces)', () => {
    const about = sources.find((s) => s.path.endsWith('about.astro'))!.text;
    const work = sources.find((s) => s.path.endsWith('work.astro'))!.text;
    const bio = sources.find((s) => s.path.endsWith('biography.astro'))!.text;
    expect(about).toContain("{' '}with");
    expect(about).toContain("{' '}<strong>AI coding copilots</strong>");
    expect(work).toContain("{' '}<strong>IFS</strong>");
    expect(bio).toContain("{' '}<strong>Innovation Management</strong>");
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
