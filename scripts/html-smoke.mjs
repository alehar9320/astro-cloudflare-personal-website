import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP_DIRS = new Set(['node_modules', '.git', '.astro']);

/**
 * Recursively collect HTML files under a directory.
 * @param {string} rootDir
 * @returns {string[]}
 */
export function findHtmlFiles(rootDir) {
  const results = [];

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results.sort();
}

/**
 * Check a single HTML document for baseline quality contracts.
 * @param {string} html
 * @param {string} [filePath]
 * @returns {string[]}
 */
export function checkDocument(html, filePath = 'document.html') {
  const failures = [];

  if (!/<html\b[^>]*\slang\s*=\s*["'][^"'\s]+["']/i.test(html)) {
    failures.push(`${filePath}: missing html lang attribute`);
  }

  if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) {
    failures.push(`${filePath}: missing non-empty title`);
  }

  if (!/<meta\b[^>]*charset\b/i.test(html)) {
    failures.push(`${filePath}: missing charset meta`);
  }

  if (!/<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(html)) {
    failures.push(`${filePath}: missing viewport meta`);
  }

  if (
    !/<meta\b[^>]*(?:name\s*=\s*["']description["']|property\s*=\s*["']og:description["'])/i.test(
      html
    )
  ) {
    failures.push(`${filePath}: missing description meta`);
  }

  if (!/<a\b[^>]*href\s*=\s*["']#main-content["'][^>]*>\s*Skip to content\s*<\/a>/i.test(html)) {
    failures.push(`${filePath}: missing skip to content`);
  }

  if (!/id\s*=\s*["']main-content["']/i.test(html)) {
    failures.push(`${filePath}: missing #main-content`);
  }

  return failures;
}

/**
 * Cloudflare adapter nests static assets under client/. Nested routes like
 * about/index.html are not the home page.
 * @param {string} relativePath
 */
function isHomeIndex(relativePath) {
  return relativePath === 'index.html' || relativePath === 'client/index.html';
}

/**
 * @param {string} relativePath
 */
function isNotFoundPage(relativePath) {
  return (
    relativePath === '404.html' ||
    relativePath === '404/index.html' ||
    relativePath === 'client/404.html' ||
    relativePath === 'client/404/index.html'
  );
}

/**
 * Work, Biography, and Contact share the Skip to content gate (#1121).
 * @param {string} relativePath
 */
function isVisitorContentPage(relativePath) {
  const routes = ['work', 'biography', 'contact'];
  return routes.some(
    (route) =>
      relativePath === `${route}/index.html` ||
      relativePath === `client/${route}/index.html`
  );
}

/**
 * @param {string} relativePath
 */
function isSkipGatedPage(relativePath) {
  return isHomeIndex(relativePath) || isNotFoundPage(relativePath) || isVisitorContentPage(relativePath);
}

/**
 * Gate: home, 404, Work, Biography, Contact. Experimental stubs stay unchecked.
 * @param {string} distDir
 * @returns {string[]}
 */
export function checkBuild(distDir) {
  const failures = [];

  if (!fs.existsSync(distDir)) {
    return [`build output not found: ${distDir}`];
  }

  const htmlFiles = findHtmlFiles(distDir);
  if (htmlFiles.length === 0) {
    return [`no HTML files found under ${distDir}`];
  }

  const relative = htmlFiles.map((file) => path.relative(distDir, file).replaceAll('\\', '/'));
  const hasIndex = relative.some(isHomeIndex);
  const has404 = relative.some(isNotFoundPage);

  if (!hasIndex) failures.push('missing index.html in build output');
  if (!has404) failures.push('missing 404.html in build output');

  for (const file of htmlFiles) {
    const rel = path.relative(distDir, file).replaceAll('\\', '/');
    if (!isSkipGatedPage(rel)) continue;
    const html = fs.readFileSync(file, 'utf8');
    failures.push(...checkDocument(html, rel));
  }

  const notFound = htmlFiles.find((file) =>
    isNotFoundPage(path.relative(distDir, file).replaceAll('\\', '/'))
  );
  if (notFound) {
    const html = fs.readFileSync(notFound, 'utf8');
    if (!/Return to Homepage/i.test(html) && !/href\s*=\s*["']\/["']/i.test(html)) {
      failures.push('404 page is missing a home link');
    }
  }

  return failures;
}

function isDirectRun() {
  const thisFile = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
  return path.resolve(thisFile) === invoked;
}

if (isDirectRun()) {
  const distDir = path.resolve(process.cwd(), process.argv[2] || 'dist');
  const failures = checkBuild(distDir);

  if (failures.length > 0) {
    console.error('HTML smoke checks failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  const pageCount = findHtmlFiles(distDir).length;
  console.log(`HTML smoke checks passed (${pageCount} pages).`);
}
