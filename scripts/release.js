import fs from 'fs';
import { execSync } from 'child_process';

const now = new Date();
const YYYY = now.getUTCFullYear();
const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
const DD = String(now.getUTCDate()).padStart(2, '0');
const HH = String(now.getUTCHours()).padStart(2, '0');
const mm = String(now.getUTCMinutes()).padStart(2, '0');
const version = `${YYYY}.${MM}.${DD}.${HH}${mm}`;

console.log(`Bumping version to ${version}`);

// Ensure directory exists
if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}

// Write to src/data/version.json
const versionData = { version };
fs.writeFileSync('src/data/version.json', JSON.stringify(versionData, null, 2));

// Get last tag
let lastTag = '';
try {
  lastTag = execSync('git describe --tags --abbrev=0', { stdio: 'pipe' }).toString().trim();
} catch (e) {
  console.log('No previous tags found. This might be the first release.');
  console.debug('Git describe error:', e.message);
}

// Get commits since last tag
let commits = '';
try {
  if (lastTag) {
    commits = execSync(`git log ${lastTag}..HEAD --oneline`, { stdio: 'pipe' }).toString().trim();
  } else {
    commits = execSync('git log --oneline', { stdio: 'pipe' }).toString().trim();
  }
} catch (e) {
  console.warn('Could not fetch git commits. Ensure you are in a git repository with history.');
  console.debug('Git log error:', e.message);
}

// Format the changelog entry
const dateStr = now.toISOString().split('T')[0];
let changelogEntry = `## [${version}] - ${dateStr}\n\n`;

if (commits) {
  const list = commits
    .split('\n')
    .filter((c) => !c.includes('[skip ci]'))
    .map((c) => `- ${c}`)
    .join('\n');
  if (list) {
    changelogEntry += `${list}\n\n`;
  } else {
    changelogEntry += `- Internal CI updates.\n\n`;
  }
} else {
  changelogEntry += `- No documented changes.\n\n`;
}

// Prepend to CHANGELOG.md
let existingChangelog = '';
try {
  existingChangelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
} catch (e) {
  console.log('CHANGELOG.md not found. A new one will be created.');
  console.debug('File read error:', e.message);
}

fs.writeFileSync('CHANGELOG.md', changelogEntry + existingChangelog);

// Output version and changelog for GitHub Release
// Set output variables for workflow access using GitHub Actions format
console.log(`\n::set-output name=version::${version}`);
console.log(`\n::set-output name=changelog::${encodeURIComponent(changelogEntry)}`);
console.log(`\n::notice title=Release Version::${version}`);

// Save changelog to a temporary file for workflow access
const tempChangelogPath = '/tmp/changelog.txt';
try {
  fs.writeFileSync(tempChangelogPath, changelogEntry);
  console.log(`Changelog saved to ${tempChangelogPath}`);
} catch (e) {
  console.warn(`Could not write changelog to temp file: ${e.message}`);
}

console.log(`Successfully prepared version ${version}`);
