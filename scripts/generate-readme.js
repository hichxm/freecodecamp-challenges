#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const challengesDir = path.join(repoRoot, 'challenges');
const workflowsDir = path.join(repoRoot, '.github', 'workflows');
const readmePath = path.join(repoRoot, 'README.md');

const FILE_REGEX = /^daily-(\d{4})-(\d{2})-(\d{2})\.test\.js$/;
const REPO_SLUG = 'hichxm/freecodecamp-challenges'; // Used for CI badge links

function buildToc() {
  return [
    '## Table of Contents',
    '- [Getting Started](#getting-started)',
    '- [Running Tests](#running-tests)',
    '- [Node Version Matrix](#node-version-matrix)',
    '- [Challenges](#challenges)',
    '- [Notes](#notes)',
    ''
  ].join('\n');
}

function buildHeader() {
  return [
    '# freecodecamp-challenges',
    '',
    'This repository contains daily coding challenge tests. Below is a list of all daily tests with links to their files.',
    '',
    buildToc(),
    '## Getting Started',
    '',
    '1. Clone this repository',
    '2. Run tests. 0 dependency:',
    '',
    '```bash',
    'npm test',
    '```',
    '',
    '## Running Tests',
    '',
    'To run all tests:',
    '',
    '```bash',
    'npm test',
    '```',
    '',
    'To run a specific test file:',
    '',
    '```bash',
    'npm test challenges/daily-YYYY-MM-DD.test.js',
    '```',
    ''
  ].join('\n');
}

function buildNodeVersionMatrix(versions, ltsInfo) {
  const header = [
    '## Node Version Matrix',
    '',
    '| Node Version | LTS | Status |',
    '|--------------|-----|--------|'
  ];

  const rows = [];

  // Add a row for the generic latest LTS workflow if present
  if (ltsInfo && ltsInfo.latest) {
    const file = 'test-lts.yaml';
    const badge = `![Node.js CI LTS](https://github.com/${REPO_SLUG}/actions/workflows/${file}/badge.svg)`;
    const link = `https://github.com/${REPO_SLUG}/actions/workflows/${file}`;
    rows.push(`| LTS latest | lts/* | [${badge}](${link}) |`);
  }

  for (const v of versions) {
    const ver = `${v}.x`;
    const numericFile = `test-${ver}.yaml`;
    const numericBadge = `![Node.js CI ${ver}](https://github.com/${REPO_SLUG}/actions/workflows/${numericFile}/badge.svg)`;
    const numericLink = `https://github.com/${REPO_SLUG}/actions/workflows/${numericFile}`;

    const codename = LTS_CODE_NAMES[v];
    const hasLts = !!(codename && ltsInfo && ltsInfo.byCodename && ltsInfo.byCodename.has(codename));
    const ltsDisplay = codename ? capitalize(codename) : '-';

    let statusCell = `[${numericBadge}](${numericLink})`;
    if (hasLts) {
      const ltsFile = `test-lts-${codename}.yaml`;
      const ltsBadge = `![Node.js CI LTS ${capitalize(codename)}](https://github.com/${REPO_SLUG}/actions/workflows/${ltsFile}/badge.svg)`;
      const ltsLink = `https://github.com/${REPO_SLUG}/actions/workflows/${ltsFile}`;
      statusCell += ` [${ltsBadge}](${ltsLink})`;
    }

    rows.push(`| ${ver} | ${ltsDisplay} | ${statusCell} |`);
  }

  return header.concat(rows).join('\n') + '\n\n';
}

function buildChallengesSection(rows) {
  const header = [
    '## Challenges',
    '',
    '| Date       | Test File                                                       |',
    '|------------|-----------------------------------------------------------------|' 
  ];
  return header.concat(rows).join('\n') + '\n';
}

async function getChallengeRows() {
  let files = [];
  try {
    files = await fs.readdir(challengesDir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const entries = files
    .map((name) => {
      const m = name.match(FILE_REGEX);
      if (!m) return null;
      const [_, y, mo, d] = m;
      const date = `${y}-${mo}-${d}`;
      return { name, date, sortKey: `${y}${mo}${d}` };
    })
    .filter(Boolean)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return entries.map((e) => `| ${e.date} | [${e.name}](challenges/${e.name}) |`);
}

async function listWorkflowFiles() {
  try {
    return await fs.readdir(workflowsDir);
  } catch (err) {
    return [];
  }
}

function extractNumericVersions(files) {
  return files
    .map(f => {
      const m = f.match(/^test-(\d+)\.x\.yaml$/);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter(v => Number.isInteger(v))
    .sort((a, b) => b - a); // Descending
}

function discoverLts(files) {
  // Return an object describing available LTS workflows
  // { latest: boolean, byCodename: Set<string> }
  const byCodename = new Set();
  let latest = false;
  for (const f of files) {
    if (f === 'test-lts.yaml') {
      latest = true;
    }
    const m = f.match(/^test-lts-([a-z]+)\.yaml$/);
    if (m) byCodename.add(m[1]);
  }
  return { latest, byCodename };
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Map Node major to its LTS codename when applicable
const LTS_CODE_NAMES = {
  4: 'argon',
  6: 'boron',
  8: 'carbon',
  10: 'dubnium',
  12: 'erbium',
  14: 'fermium',
  16: 'gallium',
  18: 'hydrogen',
  20: 'iron',
  22: 'jod'
};

async function main() {
  const [rows, workflowFiles] = await Promise.all([
    getChallengeRows(),
    listWorkflowFiles()
  ]);

  const versions = extractNumericVersions(workflowFiles);
  const ltsInfo = discoverLts(workflowFiles);

  const parts = [];
  parts.push(buildHeader());
  if (versions.length) {
    parts.push(buildNodeVersionMatrix(versions, ltsInfo));
  }
  parts.push(buildChallengesSection(rows));
  parts.push('\n## Notes\n\n- This README is auto-generated by `scripts/generate-readme.js`.\n- The Node version matrix is derived from `.github/workflows` files and combines numeric and LTS workflows.');

  const content = parts.join('\n');
  await fs.writeFile(readmePath, content, 'utf8');
  console.log(`README generated with ${rows.length} entr${rows.length === 1 ? 'y' : 'ies'}.`);
}

main().catch((err) => {
  console.error('Failed to generate README:', err);
  process.exit(1);
});
