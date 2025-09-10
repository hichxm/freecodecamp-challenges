const {expect, test, describe} = require('@jest/globals');


const daily = (str) => {
    const seen = new Set();

    for (const ch of str || '') {
        if (seen.has(ch)) return false;

        seen.add(ch);
    }

    return true;
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily("abc")).toStrictEqual(true)
    })

    test('Test 2', () => {
        expect(daily("aA")).toStrictEqual(true)
    })

    test('Test 3', () => {
        expect(daily("QwErTy123!@")).toStrictEqual(true)
    })

    test('Test 4', () => {
        expect(daily("~!@#$%^&*()_+")).toStrictEqual(true)
    })

    test('Test 5', () => {
        expect(daily("hello")).toStrictEqual(false)
    })

    test('Test 6', () => {
        expect(daily("freeCodeCamp")).toStrictEqual(false)
    })

    test('Test 7', () => {
        expect(daily("!@#*$%^&*()aA")).toStrictEqual(false)
    })
})