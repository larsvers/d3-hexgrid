// const tape = require('tape'),
// 			d3Geo = require('d3-geo'),
// 			getBoundaryPoints = require('../').getBoundaryPoints,
// 			flatten = function(array) {
// 			  return array.reduce(function(memo, el) {
// 			    var items = Array.isArray(el) ? flatten(el) : [el];
// 			    return memo.concat(items);
// 			  }, []);
// 			};

// // Should return an array.
// // Should return an array of arrays.
// // Should contain only numbers.

// tape('The getBoundaryPoints() function', test => {

// 	// const us = require('./data/us.json');
// 	// const projection = d3Geo.geoAlbers().fitSize([100, 100], us);
// 	// const result = getBoundaryPoints(us, projection);

// 	// let actual = result.constructor.name;
// 	// let expected = 'Array';
// 	// test.equal(actual, expected, 'should return an array');

// 	// const arrayTypeofSet = Array.from(new Set(result.map(el => el.constructor.name)));

// 	// actual = arrayTypeofSet.length;
// 	// expected = 1;
// 	// test.equal(actual, expected, 'should return only a single type of output structure (typeof array test 1)');

// 	// actual = arrayTypeofSet[0];
// 	// expected = 'Array';
// 	// test.equal(actual, expected, 'should return only Arrays (typeof array test 2)');

// 	// const resultTypeofSet = Array.from(new Set(flatten(result).map(el => typeof(el))));

// 	// actual = resultTypeofSet.length;
// 	// expected = 1;
// 	// test.equal(actual, expected, 'should return only a single type of output (typeof output test 1)');

// 	// actual = Array.from(new Set(flatten(result).map(el => typeof(el))))[0];
// 	// expected = 'number';
// 	// test.equal(actual, expected, 'should return only number output (typeof output test 2)');

// 	// test.end();

// });