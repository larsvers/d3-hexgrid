const tape = require('tape'),
			d3Geo = require('d3-geo'),
			luxCities = require('./data/lux_cities.json'),
			luxGeo = require('./data/lux_adm0.json'),
    	tesselate = require('../').tesselate;

const projection = d3Geo.geoMercator().fitSize([100, 100], luxGeo);
const geoPath = d3Geo.geoPath().projection(projection);

const t = tesselate()
	.pathGenerator(geoPath)
	.projection(projection)
	.geography(luxGeo)
	.hexRadius(10);

const hexGrid = t(luxCities, ['Name', 'Population']);

tape('The tesselate() function exposes', function(test) {

	let actual, expected;

  actual = typeof hexGrid.maximum, 
	expected = 'number';
  test.equal(actual, expected, 'a property called "maximum" of type "number".');

  actual = hexGrid.layout.constructor.name, 
  expected = 'Array';
  test.equal(actual, expected, 'a property called "layout" of type "Array".');

  const iRand = Math.floor(Math.random() * (hexGrid.layout.length-1));

	expected = true;

	actual = hexGrid.layout[iRand].hasOwnProperty('x');
  test.equal(actual, expected, 'an array of layout objects with an "x" property.');

	actual = hexGrid.layout[iRand].hasOwnProperty('y'), 
  test.equal(actual, expected, 'an array of layout objects with a "y" property.');

	actual = hexGrid.layout[iRand].hasOwnProperty('datapoints'), 
  test.equal(actual, expected, 'an array of layout objects with a "datapoints" property.');

  test.end();

});

tape('The tesselate() function returns', function(test) {

	let actual, expected;

	actual = hexGrid.maximum, 
	expected = 2;
  test.equal(actual, expected, 'the correct maximum of 2 for the test case.');

	actual = hexGrid.layout.length, 
	expected = 18;
  test.equal(actual, expected, 'the correct layout length of 18  for the test case.');

  const hexPointWithData = hexGrid.layout[0][0];

	actual = Object.keys(hexPointWithData).length,
	expected = 4;
  test.equal(actual, expected, 'a total of 4 object keys in a user-data populated layout object');

	expected = true;

	actual = hexPointWithData.hasOwnProperty('Name');
  test.equal(actual, expected, 'the user defined variable "Name" in a user data populated layout object.');

	actual = hexPointWithData.hasOwnProperty('Population');
  test.equal(actual, expected, 'the user defined variable "Population" in a user-data populated layout object.');

  test.end();

});
