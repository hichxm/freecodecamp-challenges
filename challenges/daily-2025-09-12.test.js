const {expect, test, describe} = require('@jest/globals');


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

describe('daily', () => {
    test('Test 1', () => {
        expect(daily([1, 2, 3, 4, 5, 6, 7])).toStrictEqual(false);
    })

    test('Test 2', () => {
        expect(daily([7, 8, 8, 4, 2, 2, 3])).toStrictEqual(false);
    })

    test('Test 3', () => {
        expect(daily([5, 6, 6, 6, 6, 6, 6])).toStrictEqual(false);
    })

    test('Test 4', () => {
        expect(daily([1, 2, 3, 11, 1, 3, 4])).toStrictEqual(true);
    })

    test('Test 5', () => {
        expect(daily([1, 2, 3, 10, 2, 1, 0])).toStrictEqual(true);
    })

    test('Test 6', () => {
        expect(daily([3, 3, 5, 8, 8, 9, 4])).toStrictEqual(true);
    })

    test('Test 7', () => {
        expect(daily([3, 9, 4, 8, 5, 7, 6])).toStrictEqual(true);
    })

    test('Custom test 1', () => {
        expect(daily([5, 6, 6, 6, 6, 6, 7])).toStrictEqual(true);
    })

    test('Custom test 2', () => {
        expect(daily([5, 6, 6, 6, 6, 6, 9])).toStrictEqual(true);
    })

    test('Custom test 2', () => {
        expect(daily([6, 6, 6, 6, 6, 6, 6])).toStrictEqual(true);
    })

})