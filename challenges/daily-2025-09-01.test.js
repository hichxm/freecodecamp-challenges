const assert = require('assert').strict;

function tribonacciSequence(startSequence, length) {

    for (let i = 0; i < length; i++) {
        if (i < 3) {
            startSequence[i] = startSequence[i] || 0;
        } else {
            startSequence[i] = startSequence[i - 3] + startSequence[i - 2] + startSequence[i - 1];
        }
    }

    return startSequence.slice(0, length);
}

assert.deepStrictEqual(tribonacciSequence([0, 0, 1], 20), [0, 0, 1, 1, 2, 4, 7, 13, 24, 44, 81, 149, 274, 504, 927, 1705, 3136, 5768, 10609, 19513]);
assert.deepStrictEqual(tribonacciSequence([21, 32, 43], 1), [21]);
assert.deepStrictEqual(tribonacciSequence([0, 0, 1], 0), []);
assert.deepStrictEqual(tribonacciSequence([10, 20, 30], 2), [10, 20]);
assert.deepStrictEqual(tribonacciSequence([10, 20, 30], 3), [10, 20, 30]);
assert.deepStrictEqual(tribonacciSequence([123, 456, 789], 8), [123, 456, 789, 1368, 2613, 4770, 8751, 16134]);
