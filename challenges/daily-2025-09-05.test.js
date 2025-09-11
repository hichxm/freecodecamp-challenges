const {expect, test, describe} = require('@jest/globals');


const daily = (ipv4) => {
    const parts = ipv4.split('.');

    if(parts.length !== 4) return false;

    for (const part of parts) {
        if(part.length === 0 || part.length > 3) return false;
        if(part < 0 || part > 255) return false;
        if(part.startsWith('0') && part.length > 1) return false;
    }

    return true;
};

describe('daily', () => {
    test('Test 1', () => {
        expect(daily('192.168.1.1')).toStrictEqual(true)
    })

    test('Test 2', () => {
        expect(daily("0.0.0.0")).toStrictEqual(true)
    })

    test('Test 3', () => {
        expect(daily('255.01.50.111')).toStrictEqual(false)
    })

    test('Test 4', () => {
        expect(daily('255.00.50.111')).toStrictEqual(false)
    })

    test('Test 5', () => {
        expect(daily('256.101.50.115')).toStrictEqual(false)
    })

    test('Test 6', () => {
        expect(daily('192.168.101.')).toStrictEqual(false)
    })

    test('Test 7', () => {
        expect(daily('192168145213')).toStrictEqual(false)
    })
})