const assert = require('node:assert').strict;

const daily = (arr1, arr2) => {
    return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)))
        .sort();
};

assert.deepStrictEqual(daily(["apple", "banana"], ["apple", "banana", "cherry"]), ["cherry"]);
assert.deepStrictEqual(daily(["apple", "banana", "cherry"], ["apple", "banana"]), ["cherry"]);
assert.deepStrictEqual(daily(["one", "two", "three", "four", "six"], ["one", "three", "eight"]), ["eight", "four", "six", "two"]);
assert.deepStrictEqual(daily(["two", "four", "five", "eight"], ["one", "two", "three", "four", "seven", "eight"]), ["five", "one", "seven", "three"]);
assert.deepStrictEqual(daily(["I", "like", "freeCodeCamp"], ["I", "like", "rocks"]), ["freeCodeCamp", "rocks"]);