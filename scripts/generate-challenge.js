#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const challengesDir = path.join(repoRoot, 'challenges');

function pad(n) { return String(n).padStart(2, '0'); }

function toYmd(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function parseArgs(argv) {
  const args = { force: false, date: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force' || a === '-f') args.force = true;
    else if (a.startsWith('--date=')) args.date = a.slice('--date='.length);
    else if (!args.date) args.date = a;
  }
  if (!args.date) args.date = toYmd(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error(`Invalid date format: ${args.date}. Expected YYYY-MM-DD`);
  }
  return args;
}

async function nodeFetchFallback(url) {
  // Minimal fetch-like fallback using https for older Node versions
  const https = require('https');
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage || '',
          text: async () => data,
          json: async () => JSON.parse(data)
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        ok: false,
        status: 0,
        statusText: err && err.message || 'network error',
        text: async () => String(err),
        json: async () => { throw err; }
      });
    });
  });
}

async function fetchChallenge(date) {
  const url = `https://api.freecodecamp.org/daily-coding-challenge/date/${date}`;
  const res = typeof fetch === 'function' ? await fetch(url) : await nodeFetchFallback(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch challenge for ${date}: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
}

function convertTestString(ts) {
  // Accept strings like: assert.isTrue(isPangram("hello", "helo"));
  let s = String(ts).trim();
  // Some test strings may come quoted; ensure we just handle raw code
  // Remove surrounding code fences or stray backticks (defensive)
  s = s.replace(/^`+|`+$/g, '');
  // Ensure no trailing semicolon for parsing convenience
  if (s.endsWith(';')) s = s.slice(0, -1);

  const startsWith = (p) => s.startsWith(p);

  if (startsWith('assert.isTrue(') && s.endsWith(')')) {
    const inner = s.slice('assert.isTrue('.length, -1);
    return `assert.strictEqual(${inner}, true);`;
  }
  if (startsWith('assert.isFalse(') && s.endsWith(')')) {
    const inner = s.slice('assert.isFalse('.length, -1);
    return `assert.strictEqual(${inner}, false);`;
  }
  if (startsWith('assert.deepEqual(')) {
    return `assert.deepStrictEqual${s.slice('assert.deepEqual'.length)};`;
  }
  if (startsWith('assert.equal(')) {
    return `assert.strictEqual${s.slice('assert.equal'.length)};`;
  }
  if (startsWith('assert.strictEqual(') || startsWith('assert.deepStrictEqual(')) {
    return s + ';';
  }

  // As a fallback, try a generic replace for isTrue / isFalse even if there's extra whitespace
  if (/^assert\s*\.\s*isTrue\s*\(/.test(s)) {
    const inner = s.replace(/^assert\s*\.\s*isTrue\s*\(/, '').replace(/\)$/, '');
    return `assert.strictEqual(${inner}, true);`;
  }
  if (/^assert\s*\.\s*isFalse\s*\(/.test(s)) {
    const inner = s.replace(/^assert\s*\.\s*isFalse\s*\(/, '').replace(/\)$/, '');
    return `assert.strictEqual(${inner}, false);`;
  }

  // Last resort: keep as comment so the user can see it
  return `// Unconverted test: ${s}`;
}

function buildFileContent(js) {
  const prelude = `const assert = require('assert').strict;\n\n`;

  // Try to extract function source from challengeFiles
  let fnSource = '';
  if (Array.isArray(js.challengeFiles) && js.challengeFiles.length > 0) {
    const first = js.challengeFiles[0];
    if (first && typeof first.contents === 'string') {
      fnSource = first.contents.trim();
      // Ensure it ends with a newline and semicolons aren't required for function decls
      fnSource += '\n\n';
    }
  }
  if (!fnSource) {
    // Fallback: define a placeholder
    fnSource = `function daily(/* args */) {\n  // TODO: implement\n}\n\n`;
  }

  const tests = Array.isArray(js.tests) ? js.tests : [];
  const converted = tests.map(t => convertTestString(t.testString || '')).join('\n');

  return prelude + fnSource + converted + '\n';
}

async function ensureDir(p) {
  try {
    await fs.mkdir(p, { recursive: true });
  } catch (_) {}
}

async function main() {
  const { date: queryDate, force } = parseArgs(process.argv);
  const data = await fetchChallenge(queryDate);

  // Use the returned date for naming, if provided
  let fileDate = null;
  if (data && typeof data.date === 'string') {
    // data.date is ISO string like 2025-09-03T00:00:00.000Z
    const d = new Date(data.date);
    if (!isNaN(d)) fileDate = toYmd(d);
  }
  if (!fileDate) fileDate = queryDate; // fallback

  const filename = `daily-${fileDate}.test.js`;
  const outPath = path.join(challengesDir, filename);

  try {
    await fs.access(outPath);
    if (!force) {
      console.error(`Refusing to overwrite existing file: ${outPath} (use --force to overwrite)`);
      process.exit(2);
    }
  } catch (_) {
    // file doesn't exist -> ok
  }

  const js = data && data.javascript ? data.javascript : {};
  const content = buildFileContent(js);

  await ensureDir(challengesDir);
  await fs.writeFile(outPath, content, 'utf8');

  console.log(`Generated: challenges/${filename}`);
}

main().catch(err => {
  console.error('Failed to generate challenge test:', err && err.stack || err);
  process.exit(1);
});
