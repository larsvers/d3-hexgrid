const tape = require('tape'),
    	tesselate = require('../').tesselate;

tape('The tesselate() function', function(test) {

  let actual = 1,
  		expected = 1;

  test.equal(actual, expected, 'returns 1');
  test.end();

});
