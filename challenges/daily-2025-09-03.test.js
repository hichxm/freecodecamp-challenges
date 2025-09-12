import {strict as assert} from 'node:assert';

const daily = (sentence, letters) => {
    letters = letters.toLowerCase().replace(/[^a-zA-Z]/g, "");
    sentence = sentence.toLowerCase().replace(/[^a-zA-Z]/g, "");

    for (const char of sentence) {
        if (!letters.includes(char)) return false;
    }

    for (const char of letters) {
        if (!sentence.includes(char)) return false;
    }

    return true;
};

assert.deepStrictEqual(daily("hello", "helo"), true);
assert.deepStrictEqual(daily("hello", "hel"), false);
assert.deepStrictEqual(daily("hello", "helow"), false);
assert.deepStrictEqual(daily("hello world", "helowrd"), true);
assert.deepStrictEqual(daily("Hello World!", "helowrd"), true);
assert.deepStrictEqual(daily("Hello World!", "heliowrd"), false);
assert.deepStrictEqual(daily("freeCodeCamp", "frcdmp"), false);
assert.deepStrictEqual(daily("The quick brown fox jumps over the lazy dog.", "abcdefghijklmnopqrstuvwxyz"), true);