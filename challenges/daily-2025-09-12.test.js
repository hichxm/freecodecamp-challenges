import {strict as assert} from 'node:assert';

const daily = (hours) => {
    if (hours.length !== 7) throw Error('Invalid hours length');

    if (
        hours.find(hour => hour >= 10) > 0 ||
        hours.reduce((acc, cur) => acc + cur, 0) / hours.length >= 6
    ) return true;

    for (let i = 0; i < 5; i++) {
        if (hours.slice(i, i + 3).reduce((acc, cur) => acc + cur, 0) / 3 >= 8) return true;
    }

    return false;
}

assert.deepStrictEqual(daily([1, 2, 3, 4, 5, 6, 7]), false);
assert.deepStrictEqual(daily([7, 8, 8, 4, 2, 2, 3]), false);
assert.deepStrictEqual(daily([5, 6, 6, 6, 6, 6, 6]), false);
assert.deepStrictEqual(daily([1, 2, 3, 11, 1, 3, 4]), true);
assert.deepStrictEqual(daily([1, 2, 3, 10, 2, 1, 0]), true);
assert.deepStrictEqual(daily([3, 3, 5, 8, 8, 9, 4]), true);
assert.deepStrictEqual(daily([3, 9, 4, 8, 5, 7, 6]), true);
assert.deepStrictEqual(daily([5, 6, 6, 6, 6, 6, 7]), true);
assert.deepStrictEqual(daily([5, 6, 6, 6, 6, 6, 9]), true);
assert.deepStrictEqual(daily([6, 6, 6, 6, 6, 6, 6]), true);