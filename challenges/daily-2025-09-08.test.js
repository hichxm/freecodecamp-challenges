const {expect, test, describe} = require('@jest/globals');


const daily = (str) => {
    let LETTERS = []

    for (const word of str.toLowerCase().split(' ')) {
        if (!((LETTERS.length >= 1) && ['a', 'for', 'an', 'and', 'by', 'of'].includes(word))) {
            LETTERS.push(word[0])
        }
    }

    return [...LETTERS].join('').toUpperCase()
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily('Search Engine Optimization')).toStrictEqual('SEO')
    })

    test('Test 2', () => {
        expect(daily("Frequently Asked Questions")).toStrictEqual('FAQ')
    })

    test('Test 3', () => {
        expect(daily('National Aeronautics and Space Administration')).toStrictEqual('NASA')
    })

    test('Test 4', () => {
        expect(daily('Federal Bureau of Investigation')).toStrictEqual('FBI')
    })

    test('Test 5', () => {
        expect(daily('For your information')).toStrictEqual('FYI')
    })

    test('Test 6', () => {
        expect(daily('By the way')).toStrictEqual('BTW')
    })

    test('Test 7', () => {
        expect(daily('An unstoppable herd of waddling penguins overtakes the icy mountains and sings happily')).toStrictEqual('AUHWPOTIMSH')
    })
})