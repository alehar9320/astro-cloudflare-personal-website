import fs from 'fs';
import { execSync } from 'child_process';

const CHANGELOG_PATH = 'CHANGELOG.md';
const VERSION_PATH = 'src/data/version.json';
const CHANGELOG_HEADER = `# Changelog

All notable changes to this project will be documented in this file.

`;

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
fs.writeFileSync(VERSION_PATH, JSON.stringify(versionData, null, 2));

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
let existingChangelog = CHANGELOG_HEADER;
try {
  existingChangelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
} catch (e) {
  console.log('CHANGELOG.md not found. A new one will be created.');
  console.debug('File read error:', e.message);
}

let changelogBody = existingChangelog;
if (existingChangelog.startsWith(CHANGELOG_HEADER)) {
  changelogBody = existingChangelog.slice(CHANGELOG_HEADER.length);
}

changelogBody = changelogBody.replaceAll(CHANGELOG_HEADER, '').replace(/^\s+/, '');

const nextChangelog = CHANGELOG_HEADER + changelogEntry + changelogBody;

fs.writeFileSync(CHANGELOG_PATH, nextChangelog);

// Write outputs to GitHub Actions for workflow consumption
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  try {
    fs.appendFileSync(githubOutput, `version=${version}\n`);
    fs.appendFileSync(githubOutput, `changelog<<EOF\n${changelogEntry}EOF\n`);
    console.log('Outputs written to GITHUB_OUTPUT');
  } catch (e) {
    console.error(`Failed to write to GITHUB_OUTPUT: ${e.message}`);
    process.exit(1);
  }
}

// Output version for GitHub Release
console.log(`\n::notice title=Release Version::${version}`);
console.log(`Successfully prepared version ${version}`);
