const tape = require('tape');
const getGridPoints = require('../').getGridPoints;

// Output:
// I want an array
// The array should have objects
// Each objcet should have 3 keys
// x, y, datapoint
// x and y should be a number
// datapoint should be 0

tape('The getGridPoints() function should', test => {

	let actual = getGridPoints(1,1,1).constructor.name;
	let expected = 'Array';

	test.equal(actual, expected, 'return an array');
	
	actual = typeof(getGridPoints(1,1,1)[0]);
	expected = 'object';

	test.equal(actual, expected, 'consist of objects');

	actual = getGridPoints(1,1,1);
	expected = [{x: 0, y: 0, datapoint: 0}];

	test.deepEqual(actual, expected, 'should deepEqual this specific array[object] structure');

	actual = getGridPoints(100,100,1).length;
	expected = 4489;

	test.equal(actual, expected, 'should return an array of this specific length');
	test.end();

});
