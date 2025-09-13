const assert = require('assert').strict;

function squaresWithThree(n) {
    let times = 0;

    for (let i = 1; i <= n; i++) {
        if((i * i).toString().includes('3')) times++;
    }

    return times;
}

assert.strictEqual(squaresWithThree(1), 0);
assert.strictEqual(squaresWithThree(10), 1);
assert.strictEqual(squaresWithThree(100), 19);
assert.strictEqual(squaresWithThree(1000), 326);
assert.strictEqual(squaresWithThree(10000), 4531);
