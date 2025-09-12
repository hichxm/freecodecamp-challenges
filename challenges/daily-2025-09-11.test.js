import assert from 'node:assert/strict';

const daily = (sentence) => {
    return sentence.replace(/\s\s+/g, ' ').split(' ').reverse().join(' ');
};

assert.deepStrictEqual(daily('world hello'), 'hello world');
assert.deepStrictEqual(daily('push commit git'), 'git commit push');
assert.deepStrictEqual(daily('npm  install  sudo'), 'sudo install npm');
assert.deepStrictEqual(daily('import    default   function  export'), 'export function default import');
assert.deepStrictEqual(daily('world hello ! how are you everyone'), 'everyone you are how ! hello world');