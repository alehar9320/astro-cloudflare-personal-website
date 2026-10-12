import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const footer = readFileSync('src/components/Footer.astro', 'utf8');
const globalCss = readFileSync('src/styles/global.css', 'utf8');

/** Pull a `--token: #hex;` value out of a CSS block. */
function token(block: string, name: string): string {
  const m = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!m) throw new Error(`token ${name} not found`);
  return m[1].toLowerCase();
}

const lightBlock = globalCss.slice(0, globalCss.indexOf(':root.theme-dark'));
const darkStart = globalCss.indexOf(':root.theme-dark');
const darkBlock = globalCss.slice(darkStart, globalCss.indexOf('}', darkStart));

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Darkest pixel of the rendered light-mode footer background (bg-footer-light
 * image + noise + hue-rotate, link text hidden) inside each footer link's box.
 * Worst case per link across widths 375/768/1024/1280 on /, /biography/,
 * /work/ and /contact/ (Chrome, DPR 1). See the PR body for the method.
 */
const WORST_LIGHT_BACKGROUND: Record<string, string> = {
  Stockholm: '#ede5ed', // 768
  Sweden: '#e9e6ec', // 768
  "What's New": '#ece8f3', // 768
  'This site': '#f2e7f2', // 768
  "What's next": '#e1eaf2', // 1280
  'Site success': '#f8dfef', // 768
  LinkedIn: '#e6e4ef', // 1280
  'IFS Blog': '#e3e4f0', // 1280
  GitHub: '#e9e0e8', // 375, overall worst
};

describe('footer link contrast in light mode', () => {
  it('pins the light resting link color to --gray-300 (#505d84)', () => {
    expect(footer).toMatch(/footer\s*\{[^}]*--footer-link-rest:\s*var\(--gray-300\);/);
    expect(footer).toMatch(/footer a\s*\{[^}]*color:\s*var\(--footer-link-rest\);/);
    expect(token(lightBlock, '--gray-300')).toBe('#505d84');
  });

  it.each(Object.entries(WORST_LIGHT_BACKGROUND))(
    'resting %s clears 4.5:1 on its worst-case background',
    (_link, bg) => {
      expect(contrast(token(lightBlock, '--gray-300'), bg)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it('the old resting color (--gray-400) did not clear 4.5:1, so the fix is needed', () => {
    const worst = Math.min(
      ...Object.values(WORST_LIGHT_BACKGROUND).map((bg) =>
        contrast(token(lightBlock, '--gray-400'), bg)
      )
    );
    expect(worst).toBeLessThan(4.5);
  });

  it('hover/focus stays --gray-200, differs from rest and clears 4.5:1', () => {
    expect(footer).toMatch(
      /footer a:hover,\s*footer a:focus-visible\s*\{[^}]*color:\s*var\(--gray-200\);/
    );
    const hover = token(lightBlock, '--gray-200');
    const rest = token(lightBlock, '--gray-300');
    expect(hover).not.toBe(rest);
    for (const bg of Object.values(WORST_LIGHT_BACKGROUND)) {
      expect(contrast(hover, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('footer reduced motion', () => {
  it('turns off the footer link color/underline transitions under prefers-reduced-motion', () => {
    const m = footer.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n {2}\}/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/footer a\b/);
    expect(m![1]).toMatch(/transition:\s*none;/);
  });
});

/**
 * Lightest pixel of the rendered dark-mode footer background (link text hidden) inside each
 * footer link's box. Worst case per link across widths 375/390/768/1024/1280 on /, /biography/,
 * /work/ and /contact/ (Chrome, DPR 1). See the PR body for the method.
 */
const WORST_DARK_BACKGROUND: Record<string, string> = {
  Stockholm: '#25292d', // 768
  Sweden: '#262b2c', // 768
  "What's New": '#221f27', // 768
  'This site': '#2c242c', // 768
  "What's next": '#342733', // 768
  'Site success': '#392c38', // 768
  LinkedIn: '#252327', // 390
  'IFS Blog': '#362a33', // 390
  GitHub: '#362e36', // 390, overall worst
};

describe('footer link contrast in dark mode', () => {
  it('pins the dark resting link color to dark --gray-300 (#a3acc8)', () => {
    expect(footer).toMatch(
      /:global\(:root\.theme-dark\) footer\s*\{\s*--footer-link-rest:\s*var\(--gray-300\);\s*\}/
    );
    expect(token(darkBlock, '--gray-300')).toBe('#a3acc8');
  });

  it.each(Object.entries(WORST_DARK_BACKGROUND))(
    'resting %s clears 4.5:1 on its worst-case dark background',
    (_link, bg) => {
      expect(contrast(token(darkBlock, '--gray-300'), bg)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it('the old dark resting color (--gray-400 #8490b5) did not clear 4.5:1, so the fix is needed', () => {
    expect(token(darkBlock, '--gray-400')).toBe('#8490b5');
    const worst = Math.min(
      ...Object.values(WORST_DARK_BACKGROUND).map((bg) => contrast('#8490b5', bg))
    );
    expect(worst).toBeLessThan(4.5);
  });

  it('dark hover stays --gray-200 (#c3cadb), differs from rest and clears 4.5:1', () => {
    const hover = token(darkBlock, '--gray-200');
    expect(hover).toBe('#c3cadb');
    expect(hover).not.toBe(token(darkBlock, '--gray-300'));
    expect(token(darkBlock, '--gray-999')).toBe('#090b11');
    for (const bg of Object.values(WORST_DARK_BACKGROUND)) {
      expect(contrast(hover, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('footer hire attributes stay unchanged', () => {
  it('keeps the footer LinkedIn hire attributes and no other hire events', () => {
    expect(footer).toMatch(
      /href="https:\/\/www\.linkedin\.com\/in\/alehar\/"[\s\S]*?data-hire-event="linkedin_click"\s+data-hire-surface="footer"/
    );
    expect(footer.match(/data-hire-event=/g)).toHaveLength(1);
    expect(footer.match(/data-hire-surface=/g)).toHaveLength(1);
  });
});
