const {expect, test, describe} = require('@jest/globals');

const daily = (matrix) => {
    const rows = matrix.length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < i; j++) {
            const temp = matrix[i][j];

            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    for (let i = 0; i < rows; i++) {
        matrix[i] = matrix[i].reverse();
    }

    return matrix;
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily([[1]])).toStrictEqual([[1]])
    })

    test('Test 2', () => {
        expect(daily([[1, 2], [3, 4]])).toStrictEqual([[3, 1], [4, 2]])
    })

    test('Test 3', () => {
        expect(daily([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toStrictEqual([[7, 4, 1], [8, 5, 2], [9, 6, 3]])
    })

    test('Test 4', () => {
        expect(daily([[0, 1, 0], [1, 0, 1], [0, 0, 0]])).toStrictEqual([[0, 1, 0], [0, 0, 1], [0, 1, 0]])
    })

    test('Custom test', () => {
        expect(daily([
            [10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19],
            [20, 21, 22, 23, 24],
            [25, 26, 27, 28, 29],
            [30, 31, 32, 33, 34],
        ])).toStrictEqual([
            [30, 25, 20, 15, 10],
            [31, 26, 21, 16, 11],
            [32, 27, 22, 17, 12],
            [33, 28, 23, 18, 13],
            [34, 29, 24, 19, 14],
        ])
    })
})