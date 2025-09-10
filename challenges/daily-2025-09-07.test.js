const {expect, test, describe} = require('@jest/globals');


const daily = (numeral) => {
    const values = {
        I: 1, V: 5, X: 10, L: 50,
        C: 100, D: 500, M: 1000
    };

    return (numeral || '').split('').reduce((acc, ch, i, arr) => {
        const cur = values[ch];
        const next = values[arr[i + 1]] || 0;

        if (cur < next) {
            return acc - cur;
        }
        return acc + cur;
    }, 0);
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily('III')).toStrictEqual(3)
    })

    test('Test 2', () => {
        expect(daily("IV")).toStrictEqual(4)
    })

    test('Test 3', () => {
        expect(daily('XXVI')).toStrictEqual(26)
    })

    test('Test 4', () => {
        expect(daily('XCIX')).toStrictEqual(99)
    })

    test('Test 5', () => {
        expect(daily('CDLX')).toStrictEqual(460)
    })

    test('Test 6', () => {
        expect(daily('DIV')).toStrictEqual(504)
    })

    test('Test 7', () => {
        expect(daily('MMXXV')).toStrictEqual(2025)
    })
})