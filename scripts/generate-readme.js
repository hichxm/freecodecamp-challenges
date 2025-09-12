#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const challengesDir = path.join(repoRoot, 'challenges');
const readmePath = path.join(repoRoot, 'README.md');

const FILE_REGEX = /^daily-(\d{4})-(\d{2})-(\d{2})\.test\.js$/;

function buildHeader() {
  return `# freecodecamp-challenges [![Node.js CI](https://github.com/hichxm/freecodecamp-challenges/actions/workflows/test.yaml/badge.svg)](https://github.com/hichxm/freecodecamp-challenges/actions/workflows/test.yaml)

This repository contains daily coding challenge tests. Below is a list of all daily tests with links to their files.

## Getting Started

1. Clone this repository
2. Install dependencies:
\n\`\`\`bash
npm install
\`\`\`

## Running Tests

To run all tests:
\n\`\`\`bash
npm test
\`\`\`

To run a specific test file:
\n\`\`\`bash
npm test challenges/daily-YYYY-MM-DD.test.js
\`\`\`

## Challenges
`;
}

function buildTable(rows) {
  const header = [
    '| Date       | Test File                                                       |',
    '|------------|-----------------------------------------------------------------|',
  ];
  return header.concat(rows).join('\n') + '\n';
}

async function getChallengeRows() {
  let files = [];
  try {
    files = await fs.readdir(challengesDir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
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
    .filter(Boolean);

  entries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return entries.map((e) => `| ${e.date} | [${e.name}](challenges/${e.name}) |`);
}

async function main() {
  const rows = await getChallengeRows();
  const header = buildHeader();
  const table = buildTable(rows);
  const content = `${header}\n${table}`;
  await fs.writeFile(readmePath, content, 'utf8');
  console.log(`README generated with ${rows.length} entr${rows.length === 1 ? 'y' : 'ies'}.`);
}

main().catch((err) => {
  console.error('Failed to generate README:', err);
  process.exit(1);
});
