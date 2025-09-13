#!/usr/bin/env node

// Simple test runner for plain Node.js assert-style test files
// - Discovers *.test.js files under ./challenges when no args are provided
// - Or runs the files/directories passed as CLI args
// - Executes each test file with `node <file>` in a child process
// - Prints a concise PASS/FAIL summary and sets a proper exit code

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const CHALLENGES_DIR = path.join(ROOT, 'challenges');

// Basic coloring without dependencies
const COLORS = {
  reset: '\u001b[0m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  dim: '\u001b[2m',
};
const color = (c, s) => COLORS[c] + s + COLORS.reset;

function isTestFile(filePath) {
  return filePath.endsWith('.test.js');
}

function listFilesRecursively(startPath) {
  const out = [];
  const stack = [startPath];
  while (stack.length) {
    const current = stack.pop();
    let stat;
    try {
      stat = fs.statSync(current);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      let entries = [];
      try {
        entries = fs.readdirSync(current);
      } catch {
        continue;
      }
      for (const e of entries) stack.push(path.join(current, e));
    } else if (stat.isFile()) {
      out.push(current);
    }
  }
  return out;
}

function resolveInputToTests(argPath) {
  const full = path.isAbsolute(argPath) ? argPath : path.join(ROOT, argPath);
  let stat;
  try {
    stat = fs.statSync(full);
  } catch {
    return [];
  }
  if (stat.isDirectory()) {
    return listFilesRecursively(full).filter(isTestFile);
  }
  return isTestFile(full) ? [full] : [];
}

function discoverAllTests() {
  // If the challenges directory doesn't exist, nothing to run
  if (!fs.existsSync(CHALLENGES_DIR)) return [];
  return listFilesRecursively(CHALLENGES_DIR)
    .filter(isTestFile)
    .sort((a, b) => a.localeCompare(b));
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function runOneTest(file) {
  const started = process.hrtime.bigint();
  const res = spawnSync(process.execPath, [file], {
    cwd: ROOT,
    encoding: 'utf8',
    env: process.env,
  });
  const ended = process.hrtime.bigint();
  const durationMs = Number(ended - started) / 1e6;

  const passed = res.status === 0;
  const output = (res.stdout || '') + (res.stderr || '');

  return {
    file,
    passed,
    status: res.status,
    signal: res.signal,
    durationMs,
    output,
    error: res.error,
  };
}

function main() {
  const args = process.argv.slice(2);
  let files = [];

  if (args.length > 0) {
    for (const a of args) {
      files.push(...resolveInputToTests(a));
    }
    // Remove duplicates and sort
    files = Array.from(new Set(files)).sort((x, y) => x.localeCompare(y));
  } else {
    files = discoverAllTests();
  }

  if (files.length === 0) {
    console.log(color('yellow', 'No test files found.'));
    process.exit(0);
  }

  console.log(color('dim', `Running ${files.length} test file(s)...`));

  let passedCount = 0;
  let failedCount = 0;
  const failures = [];
  const suiteStart = Date.now();

  for (const file of files) {
    const relative = path.relative(ROOT, file);
    const result = runOneTest(file);
    const line = `${result.passed ? 'PASS' : 'FAIL'} ${relative} (${formatDuration(Math.round(result.durationMs))})`;

    if (result.passed) {
      passedCount += 1;
      console.log(color('green', line));
    } else {
      failedCount += 1;
      console.log(color('red', line));
      failures.push(result);
    }
  }

  const total = files.length;
  const elapsed = Date.now() - suiteStart;

  if (failures.length) {
    console.log('\n' + color('red', 'Failed test output:'));
    for (const f of failures) {
      const rel = path.relative(ROOT, f.file);
      console.log(color('red', `\n● ${rel}`));
      if (f.output) {
        const trimmed = f.output.trim().split(/\r?\n/).slice(0, 20).join('\n');
        console.log(trimmed);
      } else if (f.error) {
        console.log(String(f.error));
      } else {
        console.log('(no output)');
      }
    }
  }

  console.log('\nSummary:');
  const suitesSummary = `${passedCount} passed, ${failedCount} failed, ${total} total`;
  const timeSummary = `Time: ${formatDuration(elapsed)}`;
  if (failedCount === 0) {
    console.log(color('green', `  Test Suites: ${suitesSummary}`));
  } else {
    console.log(color('red', `  Test Suites: ${suitesSummary}`));
  }
  console.log(`  ${timeSummary}`);

  process.exit(failedCount === 0 ? 0 : 1);
}

main();
