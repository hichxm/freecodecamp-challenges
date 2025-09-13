const assert = require('assert').strict;

function findMissingNumbers(arr) {
    let missingNumbers = [];

    arr = [...new Set(arr)].sort()

    for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] === i + 1) continue;

        for (let j = arr[i]; j < arr[i + 1]; j++) {
            if (arr.includes(j)) continue;

            missingNumbers.push(j);
        }
    }

    return missingNumbers.sort();
}

assert.deepStrictEqual(findMissingNumbers([1, 3, 5]), [2, 4]);
assert.deepStrictEqual(findMissingNumbers([1, 2, 3, 4, 5]), []);
assert.deepStrictEqual(findMissingNumbers([1, 10]), [2, 3, 4, 5, 6, 7, 8, 9]);
assert.deepStrictEqual(findMissingNumbers([10, 1, 10, 1, 10, 1]), [2, 3, 4, 5, 6, 7, 8, 9]);
assert.deepStrictEqual(findMissingNumbers([1, 2, 3, 4, 5]), []);
assert.deepStrictEqual(findMissingNumbers([1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 6, 8, 9, 3, 2, 10, 7, 4]), [11]);
