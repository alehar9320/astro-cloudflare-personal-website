import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Laboratory page & canvas interactive elements', () => {
  const labPath = 'src/pages/lab/index.astro';

  it('ensures the laboratory page file exists', () => {
    expect(existsSync(labPath)).toBe(true);
  });

  it('contains proper accessibility, Canvas element, and controls', () => {
    const pageText = readFileSync(labPath, 'utf8');

    // Title and layout structure
    expect(pageText).toContain("const pageTitle = 'Northern Lights | Alexander Härenstam'");
    expect(pageText).toContain('title={pageTitle}');
    expect(pageText).toContain('BaseLayout');
    expect(pageText).toContain('Hero title="Northern lights"');
    expect(pageText).toContain('robots="noindex"');

    // Interactive canvas markup
    expect(pageText).toContain('id="aurora-refraction-canvas"');
    expect(pageText).toContain(
      'aria-label="Northern lights. Move your pointer to shift the waves."'
    );
    expect(pageText).toContain('id="toggle-anim-btn"');
    expect(pageText).toContain('Pause');

    // Canvas math and lifecycle features
    expect(pageText).toContain('prefers-reduced-motion');
    expect(pageText).toContain('astro:before-swap');
    expect(pageText).toContain('astro:page-load');
    expect(pageText).toContain('requestAnimationFrame');
    expect(pageText).toContain('cancelAnimationFrame');
  });
});
