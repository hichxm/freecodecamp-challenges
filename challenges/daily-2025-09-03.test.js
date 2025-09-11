const {expect, test, describe} = require('@jest/globals');


const daily = (sentence, letters) => {
    letters = letters.toLowerCase().replaceAll(/[^a-zA-Z]/g, "");
    sentence = sentence.toLowerCase().replaceAll(/[^a-zA-Z]/g, "");

    for (const char of sentence) {
        if(!letters.includes(char)) return false;
    }

    for (const char of letters) {
        if(!sentence.includes(char)) return false;
    }

    return true;
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily("hello", "helo")).toStrictEqual(true)
    })

    test('Test 2', () => {
        expect(daily("hello", "hel")).toStrictEqual(false)
    })

    test('Test 3', () => {
        expect(daily("hello", "helow")).toStrictEqual(false)
    })

    test('Test 4', () => {
        expect(daily("hello world", "helowrd")).toStrictEqual(true)
    })

    test('Test 5', () => {
        expect(daily("Hello World!", "helowrd")).toStrictEqual(true)
    })

    test('Test 6', () => {
        expect(daily("Hello World!", "heliowrd")).toStrictEqual(false)
    })

    test('Test 7', () => {
        expect(daily("freeCodeCamp", "frcdmp")).toStrictEqual(false)
    })

    test('Test 8', () => {
        expect(daily("The quick brown fox jumps over the lazy dog.", "abcdefghijklmnopqrstuvwxyz")).toStrictEqual(true)
    })
})