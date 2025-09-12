const assert = require('assert').strict;

const daily = (ipv4) => {
    const parts = ipv4.split('.');

    if (parts.length !== 4) return false;

    for (const part of parts) {
        if (part.length === 0 || part.length > 3) return false;
        if (part < 0 || part > 255) return false;
        if (part.startsWith('0') && part.length > 1) return false;
    }

    return true;
};

assert.deepStrictEqual(daily('192.168.1.1'), true);
assert.deepStrictEqual(daily('0.0.0.0'), true);
assert.deepStrictEqual(daily('255.01.50.111'), false);
assert.deepStrictEqual(daily('255.00.50.111'), false);
assert.deepStrictEqual(daily('256.101.50.115'), false);
assert.deepStrictEqual(daily('192.168.101.'), false);
assert.deepStrictEqual(daily('192168145213'), false);