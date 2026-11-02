import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { withBrandName } from './share-title';

describe('LinkedIn share names Alexander Härenstam on every page', () => {
  it('puts Alexander Härenstam in every share and browser title', () => {
    expect(
      withBrandName('Alexander Härenstam | Product Manager, Developer Experience at IFS')
    ).toBe('Alexander Härenstam | Product Manager, Developer Experience at IFS');
    expect(withBrandName('Product Manager, Developer Experience at IFS')).toBe(
      'Alexander Härenstam | Product Manager, Developer Experience at IFS'
    );
    expect(withBrandName('IFS Design System | Product Manager, Developer Experience at IFS')).toBe(
      'IFS Design System | Alexander Härenstam'
    );
    expect(withBrandName("What's New | Product Manager, Developer Experience at IFS")).toBe(
      "What's New | Alexander Härenstam"
    );
    expect(withBrandName('Site success')).toBe('Site success | Alexander Härenstam');
  });

  it('declares the square portrait share image with size, alt and site name', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain("import { withBrandName } from '../utils/share-title';");
    expect(head).toContain('const shareTitle = withBrandName(ogTitle ?? title);');
    expect(head).toContain('<title>{withBrandName(title)}</title>');
    expect(head).toContain('<meta property="og:site_name" content="Alexander Härenstam" />');
    expect(head).toContain('<meta property="og:image:width" content="800" />');
    expect(head).toContain('<meta property="og:image:height" content="800" />');
    expect(head).toContain('<meta property="og:image:type" content="image/png" />');
    expect(head).toContain('<meta property="og:image:alt" content="Alexander Härenstam" />');
    expect(head).toContain('<meta name="twitter:card" content="summary" />');
    expect(head).toContain('<meta name="twitter:image:alt" content="Alexander Härenstam" />');
    expect(head).not.toContain('summary_large_image');
    expect(head).toContain("shareImage = 'https://me.alehar.workers.dev/assets/portrait.png'");
  });
});
