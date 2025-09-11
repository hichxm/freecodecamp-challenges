const {expect, test, describe} = require('@jest/globals');


const daily = (sentence) => {
    return sentence.replaceAll(/\s\s+/g, ' ').split(' ').reverse().join(' ');
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily('world hello')).toStrictEqual('hello world')
    })

    test('Test 2', () => {
        expect(daily('push commit git')).toStrictEqual('git commit push')
    })

    test('Test 3', () => {
        expect(daily('npm  install  sudo')).toStrictEqual('sudo install npm')
    })

    test('Test 4', () => {
        expect(daily('import    default   function  export')).toStrictEqual('export function default import')
    })

    test('Custom test 1', () => {
        expect(daily('world hello ! how are you everyone')).toStrictEqual('everyone you are how ! hello world')
    })
})