import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Stratus Performance & Edge Infrastructure', () => {
  it('defines 1-year immutable caching for static assets in public/_headers', () => {
    expect(existsSync('public/_headers')).toBe(true);
    const headers = readFileSync('public/_headers', 'utf8');
    expect(headers).toContain('/assets/*');
    expect(headers).toContain('Cache-Control: public, max-age=31536000, immutable');
  });

  it('preloads critical above-the-fold hero background images in MainHead.astro', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain('rel="preload"');
    expect(head).toContain('as="image"');
    expect(head).toContain('/assets/backgrounds/bg-main-dark-800w.jpg');
    expect(head).toContain('/assets/backgrounds/bg-main-dark-1440w.jpg');
  });

  it('uses non-render-blocking Google Fonts loading in MainHead.astro', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain('rel="preload"');
    expect(head).toContain('as="style"');
    expect(head).toContain('media="print"');
    expect(head).toContain('onload="this.media=\'all\'"');
    expect(head).toContain('<noscript>');
  });
});
