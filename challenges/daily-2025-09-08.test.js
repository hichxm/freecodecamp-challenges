import assert from 'node:assert/strict';

const daily = (str) => {
    let LETTERS = []

    for (const word of str.toLowerCase().split(' ')) {
        if (!((LETTERS.length >= 1) && ['a', 'for', 'an', 'and', 'by', 'of'].includes(word))) {
            LETTERS.push(word[0])
        }
    }

    return [...LETTERS].join('').toUpperCase()
};

assert.deepStrictEqual(daily('Search Engine Optimization'), 'SEO');
assert.deepStrictEqual(daily('Frequently Asked Questions'), 'FAQ');
assert.deepStrictEqual(daily('National Aeronautics and Space Administration'), 'NASA');
assert.deepStrictEqual(daily('Federal Bureau of Investigation'), 'FBI');
assert.deepStrictEqual(daily('For your information'), 'FYI');
assert.deepStrictEqual(daily('By the way'), 'BTW');
assert.deepStrictEqual(daily('An unstoppable herd of waddling penguins overtakes the icy mountains and sings happily'), 'AUHWPOTIMSH');