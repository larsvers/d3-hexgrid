var tape = require('tape'),
    tesselate = require('../');

tape('The tesselate() function', function(test) {
  var actual = tesselate.tesselate();
  var expected = 1;

  test.equal(actual, expected, 'returns 1');
  test.end();
});
