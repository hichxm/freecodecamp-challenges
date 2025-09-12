import {strict as assert} from 'node:assert';

const daily = (str) => {
    const seen = new Set();

    for (const ch of str || '') {
        if (seen.has(ch)) return false;

        seen.add(ch);
    }

    return true;
};

assert.deepStrictEqual(daily('abc'), true);
assert.deepStrictEqual(daily('aA'), true);
assert.deepStrictEqual(daily('QwErTy123!@'), true);
assert.deepStrictEqual(daily('~!@#$%^&*()_+'), true);
assert.deepStrictEqual(daily('hello'), false);
assert.deepStrictEqual(daily('freeCodeCamp'), false);
assert.deepStrictEqual(daily('!@#*$%^&*()aA'), false);