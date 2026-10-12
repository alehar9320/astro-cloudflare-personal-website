import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe("What's New in-site continue", () => {
  const page = readFileSync('src/pages/whats-new.astro', 'utf8');

  it("What's New offers Read the IFS Design System case before the GitHub history link", () => {
    const cont = page.indexOf('class="history-link whats-new-continue"');
    const gh = page.indexOf(
      'href="https://github.com/alehar9320/astro-cloudflare-personal-website/commits"'
    );
    const mainEnd = page.indexOf('</main>');
    expect(cont).toBeGreaterThan(-1);
    expect(page).toMatch(
      /<a\s+class="history-link whats-new-continue"\s+href="\/work\/ifs-design-system\/"\s*>\s*Read the IFS Design System case\s*<\/a>/
    );
    expect(cont).toBeLessThan(gh);
    expect(cont).toBeLessThan(mainEnd);
    const anchor = page.slice(cont - 40, page.indexOf('</a>', cont));
    expect(anchor).not.toContain('target=');
    expect(anchor).not.toContain('linkedin.com');
  });

  it('sits after every update section, outside any conditional, so it shows in every state', () => {
    const cont = page.indexOf('<p class="continue">');
    for (const id of ['this-week-heading', 'latest-updates-heading', 'last-30-heading']) {
      expect(page.indexOf(`id="${id}"`)).toBeGreaterThan(-1);
      expect(page.indexOf(`id="${id}"`)).toBeLessThan(cont);
    }
    // Eden lock: the role="status" empty/failed lines keep the history link directly below them.
    expect(cont).toBeLessThan(page.indexOf('{NO_VISITOR_UPDATES_COPY}'));
    expect(cont).toBeLessThan(page.indexOf('{UPDATES_UNAVAILABLE_COPY}'));
    // Top-level in <main>: the only `{` blocks before it are closed.
    const before = page.slice(page.indexOf('<main'), cont);
    expect(before.split('{').length).toBe(before.split('}').length);
  });

  it('adds no hire door, card or new style to <main>', () => {
    const main = page.slice(page.indexOf('<main'), page.indexOf('</main>'));
    expect(main).not.toMatch(/linkedin|data-hire/i);
    expect(main.match(/<a\b/g)).toHaveLength(2);
    expect(page).not.toMatch(/\.continue\s*\{|\.whats-new-continue\s*\{/);
  });
});
