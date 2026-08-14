import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkBuild, checkDocument, findHtmlFiles } from '../scripts/html-smoke.mjs';

const validHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="A valid page" />
    <title>Valid Page</title>
  </head>
  <body>
    <main id="main-content">Hello</main>
  </body>
</html>`;

const valid404 = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="404 Error — this page was not found" />
    <title>Not Found</title>
  </head>
  <body>
    <main id="main-content">
      <a href="/">Return to Homepage</a>
    </main>
  </body>
</html>`;

const tempDirs: string[] = [];

function makeDist(files: Record<string, string>) {
  const dir = mkdtempSync(path.join(tmpdir(), 'html-smoke-'));
  tempDirs.push(dir);
  for (const [relative, contents] of Object.entries(files)) {
    const fullPath = path.join(dir, relative);
    mkdirSync(path.dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, contents);
  }
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('HTML document contracts', () => {
  it('accepts a page with lang, title, charset, viewport, and description', () => {
    expect(checkDocument(validHtml, 'index.html')).toEqual([]);
  });

  it('reports each missing contract on a bare document', () => {
    const failures = checkDocument('<html></html>', 'bare.html');
    expect(failures).toEqual(
      expect.arrayContaining([
        'bare.html: missing html lang attribute',
        'bare.html: missing non-empty title',
        'bare.html: missing charset meta',
        'bare.html: missing viewport meta',
        'bare.html: missing description meta',
      ])
    );
  });

  it('rejects an empty title', () => {
    const html = validHtml.replace('Valid Page', '');
    expect(checkDocument(html, 'empty-title.html')).toContain(
      'empty-title.html: missing non-empty title'
    );
  });
});

describe('build output contracts', () => {
  it('passes a dist tree with index and 404 pages', () => {
    const dist = makeDist({
      'index.html': validHtml,
      '404.html': valid404,
    });
    expect(checkBuild(dist)).toEqual([]);
    expect(findHtmlFiles(dist)).toHaveLength(2);
  });

  it('passes when the home page is nested under client/', () => {
    const dist = makeDist({
      'client/index.html': validHtml,
      '404.html': valid404,
    });
    expect(checkBuild(dist)).toEqual([]);
  });

  it('fails when the build directory is missing', () => {
    expect(checkBuild('/tmp/html-smoke-missing-dist')).toEqual([
      'build output not found: /tmp/html-smoke-missing-dist',
    ]);
  });

  it('fails when index or 404 is absent', () => {
    const dist = makeDist({ 'about/index.html': validHtml });
    expect(checkBuild(dist)).toEqual(
      expect.arrayContaining([
        'missing index.html in build output',
        'missing 404.html in build output',
      ])
    );
  });

  it('fails when the 404 page has no way home', () => {
    const dist = makeDist({
      'index.html': validHtml,
      '404.html': validHtml,
    });
    expect(checkBuild(dist)).toContain('404 page is missing a home link');
  });
});
