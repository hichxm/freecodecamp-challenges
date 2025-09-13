const {readdir, readFile} = require('fs').promises;
const {resolve, join} = require('path');
const {pathToFileURL} = require('url');

const challengesDir = resolve('challenges');

function createSoftAssert(collect) {
    const realAssert = require('assert');
    const wrappedMap = new WeakMap();

    const isAssertionError = (e) => e && (e instanceof realAssert.AssertionError || e.name === 'AssertionError');

    const wrapFn = (fn, name) => {
        return function wrapped(...args) {
            try {
                return fn.apply(this, args);
            } catch (e) {
                if (isAssertionError(e)) {
                    collect({
                        method: name,
                        message: e.message,
                        actual: e.actual,
                        expected: e.expected,
                        operator: e.operator,
                        stack: e.stack
                    });
                    // Do not throw to allow remaining assertions to execute
                    return;
                }
                // Non-assertion error: rethrow
                throw e;
            }
        };
    };

    const wrapObject = (src) => {
        if (wrappedMap.has(src)) return wrappedMap.get(src);
        // callable function version (assert(value[, message]))
        const callable = wrapFn(src, 'assert');
        wrappedMap.set(src, callable);
        // Copy all props (convert accessors to data where needed)
        for (const key of Object.getOwnPropertyNames(src)) {
            const desc = Object.getOwnPropertyDescriptor(src, key);
            if (!desc) continue;
            let value = desc.value;
            // Resolve accessor to actual value so we can wrap it
            if (value === undefined && (desc.get || desc.set)) {
                try { value = src[key]; } catch (_) {}
            }
            let newValue = value;
            if (key === 'strict') {
                // Ensure strict is fully wrapped (function with methods)
                const strictSrc = value || src.strict; // fallback to live getter
                if (strictSrc === src) {
                    newValue = callable; // self-reference
                } else {
                    newValue = wrapObject(strictSrc);
                }
            } else if (typeof value === 'function') {
                newValue = wrapFn(value, key);
            }
            try {
                Object.defineProperty(callable, key, { configurable: true, enumerable: desc.enumerable, writable: true, value: newValue });
            } catch (_) {
                // ignore non-writable properties
                try { callable[key] = newValue; } catch (_) {}
            }
        }
        return callable;
    };

    return wrapObject(realAssert);
}

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
        const failures = [];
        const softAssert = createSoftAssert((x) => failures.push(x));
        const realRequire = require;
        const sandboxRequire = (mod) => mod === 'assert' ? softAssert : realRequire(mod);
        try {
            const code = await readFile(new URL(url), 'utf8');
            // Shadow require inside eval scope
            {
                const require = sandboxRequire;
                eval(code);
            }

            if (failures.length > 0) {
                const details = failures.map((f, i) => `  ${i + 1}) ${f.method}: ${f.message}` ).join('\n');
                const err = new Error(`${failures.length} assertion(s) failed in ${file}:\n${details}`);
                err.failures = failures;
                throw err;
            }

            console.log(`PASS ${file}`);
        } catch (err) {
            failed++;
            console.error(`FAIL ${file}`);
            console.error(err && err.stack || err);
            // If we captured detailed failures, also list them with stacks for clarity
            if (err && err.failures && Array.isArray(err.failures)) {
                for (const [i, f] of err.failures.entries()) {
                    console.error(`\nFailure ${i + 1}: ${f.method} - ${f.message}`);
                    if (f.operator !== undefined) console.error(`operator: ${f.operator}`);
                    if (f.expected !== undefined || f.actual !== undefined) {
                        try {
                            const exp = typeof f.expected === 'string' ? f.expected : JSON.stringify(f.expected);
                            const act = typeof f.actual === 'string' ? f.actual : JSON.stringify(f.actual);
                            console.error(`expected: ${exp}`);
                            console.error(`actual:   ${act}`);
                        } catch (_) {}
                    }
                    if (f.stack) console.error(f.stack);
                }
            }
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
