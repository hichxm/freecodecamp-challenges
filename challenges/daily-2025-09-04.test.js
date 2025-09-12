const assert = require('assert').strict;

const daily = (str) => {

    let multiplier = 1;

    let newStr = '';

    for (let char of str.split('')) {
        if (/[aAeEiIoOuU]/g.test(char)) {
            newStr = newStr +
                char +
                char.toLowerCase().repeat(multiplier - 1);

            multiplier++;
        } else {
            newStr = newStr + char;
        }
    }

    return newStr
};

assert.deepStrictEqual(daily('hello world'), 'helloo wooorld');
assert.deepStrictEqual(daily('freeCodeCamp'), 'freeeCooodeeeeCaaaaamp');
assert.deepStrictEqual(daily('AEIOU'), 'AEeIiiOoooUuuuu');
assert.deepStrictEqual(daily('I like eating ice cream in Iceland'), 'I liikeee eeeeaaaaatiiiiiing iiiiiiiceeeeeeee creeeeeeeeeaaaaaaaaaam iiiiiiiiiiin Iiiiiiiiiiiiceeeeeeeeeeeeelaaaaaaaaaaaaaand');
assert.deepStrictEqual(daily('Ma femme cest la meilleure du monde'), 'Ma feemmeee ceeeest laaaaa meeeeeeiiiiiiilleeeeeeeeuuuuuuuuureeeeeeeeee duuuuuuuuuuu moooooooooooondeeeeeeeeeeeee');