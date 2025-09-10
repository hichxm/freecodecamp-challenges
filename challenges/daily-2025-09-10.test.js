const {expect, test, describe} = require('@jest/globals');

const daily = (arr1, arr2) => {
    return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)))
        .sort();
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily(["apple", "banana"], ["apple", "banana", "cherry"]))
            .toStrictEqual(["cherry"])
    })

    test('Test 2', () => {
        expect(daily(["apple", "banana", "cherry"], ["apple", "banana"]))
            .toStrictEqual(["cherry"])
    })

    test('Test 3', () => {
        expect(daily(["one", "two", "three", "four", "six"], ["one", "three", "eight"]))
            .toStrictEqual(["eight", "four", "six", "two"])
    })

    test('Test 4', () => {
        expect(daily(["two", "four", "five", "eight"], ["one", "two", "three", "four", "seven", "eight"]))
            .toStrictEqual(["five", "one", "seven", "three"])
    })

    test('Test 5', () => {
        expect(daily(["I", "like", "freeCodeCamp"], ["I", "like", "rocks"]))
            .toStrictEqual(["freeCodeCamp", "rocks"])
    })
})