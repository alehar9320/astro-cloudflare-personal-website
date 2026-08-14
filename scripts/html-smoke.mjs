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

  return failures;
}

/**
 * Check a built site directory for required pages and document contracts.
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

  const normalized = htmlFiles.map((file) => file.replaceAll('\\', '/'));
  const hasIndex = normalized.some(
    (file) => file.endsWith('/index.html') || file.endsWith('index.html')
  );
  const has404 = normalized.some((file) => /\/404\.html$|\/404\/index\.html$/i.test(file));

  if (!hasIndex) failures.push('missing index.html in build output');
  if (!has404) failures.push('missing 404.html in build output');

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    failures.push(...checkDocument(html, path.relative(distDir, file)));
  }

  const notFound = htmlFiles.find((file) =>
    /404\.html$|404\/index\.html$/i.test(file.replaceAll('\\', '/'))
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
