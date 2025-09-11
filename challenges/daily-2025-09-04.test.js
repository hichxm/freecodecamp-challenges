const {expect, test, describe} = require('@jest/globals');


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

describe('daily', () => {
    test('Test 1', () => {
        expect(daily('hello world')).toStrictEqual('helloo wooorld')
    })

    test('Test 2', () => {
        expect(daily('freeCodeCamp')).toStrictEqual('freeeCooodeeeeCaaaaamp')
    })

    test('Test 3', () => {
        expect(daily('AEIOU')).toStrictEqual('AEeIiiOoooUuuuu')
    })

    test('Test 4', () => {
        expect(daily('I like eating ice cream in Iceland')).toStrictEqual('I liikeee eeeeaaaaatiiiiiing iiiiiiiceeeeeeee creeeeeeeeeaaaaaaaaaam iiiiiiiiiiin Iiiiiiiiiiiiceeeeeeeeeeeeelaaaaaaaaaaaaaand')
    })

    test('Custom test 1', () => {
        expect(daily('Ma femme cest la meilleure du monde')).toStrictEqual('Ma feemmeee ceeeest laaaaa meeeeeeiiiiiiilleeeeeeeeuuuuuuuuureeeeeeeeee duuuuuuuuuuu moooooooooooondeeeeeeeeeeeee')
    })
})