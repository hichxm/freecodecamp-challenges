const assert = require('assert').strict;

function milePace(miles, duration) {
  duration = duration.split(':');
  duration = parseInt(duration[0]) * 60 + parseInt(duration[1]);

  const hours = parseInt(Math.round(duration / miles) / 60).toString().padStart(2, '0');
  const minutes = parseInt((duration / miles) % 60).toString().padStart(2, '0');


  return hours + ':' + minutes;
}

assert.strictEqual(milePace(3, "24:00"), "08:00");
assert.strictEqual(milePace(1, "06:45"), "06:45");
assert.strictEqual(milePace(2, "07:00"), "03:30");
assert.strictEqual(milePace(26.2, "120:35"), "04:36");

// Custom tests
assert.strictEqual(milePace(4, "01:00"), "00:15");
