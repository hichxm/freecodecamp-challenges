const assert = require('assert').strict;

function isValidNumber(n, base) {
    const allowedCharacters = '0123456789ABCDEFGHIJLMNOPQRSTUVWXYZ'

    const re = new RegExp('[' + allowedCharacters.slice(0, base).toLowerCase() + ']')

    return n
        .split('')
        .every(char => re.test(char.toLowerCase()))
}

assert.strictEqual(isValidNumber("10101", 2), true);
assert.strictEqual(isValidNumber("10201", 2), false);
assert.strictEqual(isValidNumber("76543210", 8), true);
assert.strictEqual(isValidNumber("9876543210", 8), false);
assert.strictEqual(isValidNumber("9876543210", 10), true);
assert.strictEqual(isValidNumber("ABC", 10), false);
assert.strictEqual(isValidNumber("ABC", 16), true);
assert.strictEqual(isValidNumber("Z", 36), true);
assert.strictEqual(isValidNumber("ABC", 20), true);
assert.strictEqual(isValidNumber("4B4BA9", 16), true);
assert.strictEqual(isValidNumber("5G3F8F", 16), false);
assert.strictEqual(isValidNumber("5G3F8F", 17), true);
assert.strictEqual(isValidNumber("abc", 10), false);
assert.strictEqual(isValidNumber("abc", 16), true);
assert.strictEqual(isValidNumber("AbC", 16), true);
assert.strictEqual(isValidNumber("z", 36), true);
