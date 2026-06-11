import fs from 'fs';
import { execSync } from 'child_process';

const now = new Date();
const YYYY = now.getUTCFullYear();
const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
const DD = String(now.getUTCDate()).padStart(2, '0');
const HH = String(now.getUTCHours()).padStart(2, '0');
const mm = String(now.getUTCMinutes()).padStart(2, '0');
const version = `${YYYY}.${MM}.${DD}.${HH}${mm}`;

console.log({ event: 'release_script_start', version });

let lastTag = '';
try {
  lastTag = execSync('git describe --tags --abbrev=0', { stdio: 'pipe' }).toString().trim();
} catch (e) {
  const error = e instanceof Error ? e.message : String(e);
  console.log({ event: 'release_script_no_tags', error });
}

let commits = '';
try {
  if (lastTag) {
    commits = execSync(`git log ${lastTag}..HEAD --oneline`, { stdio: 'pipe' }).toString().trim();
  } else {
    commits = execSync('git log --oneline', { stdio: 'pipe' }).toString().trim();
  }
} catch (e) {
  const error = e instanceof Error ? e.message : String(e);
  console.warn({ event: 'release_script_git_log_error', error });
}

let changelog = '';

if (commits) {
  const entries = commits
    .split('\n')
    .map((commit) => commit.trim())
    .filter(Boolean)
    .filter((commit) => !commit.includes('[skip ci]'))
    .map((commit) => `- ${commit}`);

  if (entries.length > 0) {
    changelog = `${entries.join('\n')}\n`;
  } else {
    changelog = '- Internal CI updates.\n';
  }
} else {
  changelog = '- No documented changes.\n';
}

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  try {
    fs.appendFileSync(githubOutput, `version=${version}\n`);
    fs.appendFileSync(githubOutput, `changelog<<EOF\n${changelog}EOF\n`);
    console.log({ event: 'release_script_output_success' });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error({ event: 'release_script_output_error', error });
    process.exit(1);
  }
}

console.log(`\n::notice title=Release Version::${version}`);
console.log({ event: 'release_script_complete', version });
