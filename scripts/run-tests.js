const {readdir, readFile} = require('fs').promises;
const {resolve, join} = require('path');
const {pathToFileURL} = require('url');

const challengesDir = resolve('challenges');

async function main() {
    let failed = 0;
    const files = (await readdir(challengesDir))
        .filter(f => f.endsWith('.test.js'))
        .sort();

    if (files.length === 0) {
        console.log('No test files found.');
        return;
    }

    for (const file of files) {
        const url = pathToFileURL(join(challengesDir, file)).href;
        try {
            eval(await readFile(new URL(url).pathname, 'utf8'));

            console.log(`PASS ${file}`);
        } catch (err) {
            failed++;
            console.error(`FAIL ${file}`);
            console.error(err && err.stack || err);
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} test file(s) failed.`);
        process.exit(1);
    } else {
        console.log(`\nAll ${files.length} test file(s) passed.`);
    }
}

main().catch(err => {
    console.error('Test runner error:', err && err.stack || err);
    process.exit(1);
});
