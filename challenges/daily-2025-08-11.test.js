const assert = require('assert').strict;

function isBalanced(s) {
  if (s.length === 1) return true;

  return ((s.slice(0, s.length / 2) || '').match(/[aeiou]/gi) || []).length ===
      ((s.slice(s.length % 2 === 0 ? s.length / 2 : s.length / 2 + 1) || '').match(/[aeiou]/gi) || []).length;
}

assert.strictEqual(isBalanced("racecar"), true);
assert.strictEqual(isBalanced("Lorem Ipsum"), true);
assert.strictEqual(isBalanced("Kitty Ipsum"), false);
assert.strictEqual(isBalanced("string"), false);
assert.strictEqual(isBalanced(" "), true);
assert.strictEqual(isBalanced("abcdefghijklmnopqrstuvwxyz"), false);
assert.strictEqual(isBalanced("123A#b!E&*456-o.U"), true);
