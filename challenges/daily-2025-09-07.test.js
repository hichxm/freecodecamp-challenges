const assert = require('node:assert').strict;

const daily = (numeral) => {
    const values = {
        I: 1, V: 5, X: 10, L: 50,
        C: 100, D: 500, M: 1000
    };

    return (numeral || '').split('').reduce((acc, ch, i, arr) => {
        const cur = values[ch];
        const next = values[arr[i + 1]] || 0;

        if (cur < next) {
            return acc - cur;
        }
        return acc + cur;
    }, 0);
};

assert.deepStrictEqual(daily('III'), 3);
assert.deepStrictEqual(daily('IV'), 4);
assert.deepStrictEqual(daily('XXVI'), 26);
assert.deepStrictEqual(daily('XCIX'), 99);
assert.deepStrictEqual(daily('CDLX'), 460);
assert.deepStrictEqual(daily('DIV'), 504);
assert.deepStrictEqual(daily('MMXXV'), 2025);