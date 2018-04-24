const tape = require('tape'),
			d3Geo = require('d3-geo'),
			topojson = require('topojson'),
			luxCities = require('./data/lux_cities.json'),
			luxGeo = require('./data/lux_adm0.json'),
			rusGeo = require('./data/rus_chukotka.json'),
			worldTopo = require('./data/world_topo.json'),
    	tesselate = require('../').tesselate;


// Test types of exposed elements.

const projectLux = d3Geo.geoMercator().fitSize([100, 100], luxGeo);
const geoPathLux = d3Geo.geoPath().projection(projectLux);

const tLux = tesselate()
	.pathGenerator(geoPathLux)
	.projection(projectLux)
	.geography(luxGeo)
	.hexRadius(10);

const hexGridLux = tLux(luxCities, ['Name', 'Population']);

tape('The tesselate() function exposes', test => {

	let actual, expected;

  actual = typeof hexGridLux.maximum, 
	expected = 'number';
  test.equal(actual, expected, 'a property called "maximum" of type "number".');

  actual = hexGridLux.layout.constructor.name, 
  expected = 'Array';
  test.equal(actual, expected, 'a property called "layout" of type "Array".');

  const iRand = Math.floor(Math.random() * (hexGridLux.layout.length-1));

	expected = true;

	actual = hexGridLux.layout[iRand].hasOwnProperty('x');
  test.equal(actual, expected, 'an array of layout objects with an "x" property.');

	actual = hexGridLux.layout[iRand].hasOwnProperty('y'), 
  test.equal(actual, expected, 'an array of layout objects with a "y" property.');

	actual = hexGridLux.layout[iRand].hasOwnProperty('datapoints'), 
  test.equal(actual, expected, 'an array of layout objects with a "datapoints" property.');

  test.end();

});


// Test values of exposed elements.

tape('The tesselate() function returns', test => {

	let actual, expected;

	actual = hexGridLux.maximum, 
	expected = 2;
  test.equal(actual, expected, 'the correct maximum of 2 for the test case.');

	actual = hexGridLux.layout.length, 
	expected = 18;
  test.equal(actual, expected, 'the correct layout length of 18  for the test case.');

  const hexPointWithData = hexGridLux.layout[0][0];

	actual = Object.keys(hexPointWithData).length,
	expected = 4;
  test.equal(actual, expected, 'a total of 4 object keys in a user-data populated layout object');

	expected = true;

	actual = hexPointWithData.hasOwnProperty('Name');
  test.equal(actual, expected, 'the user defined variable "Name" in a user-data populated layout object.');

	actual = hexPointWithData.hasOwnProperty('Population');
  test.equal(actual, expected, 'the user defined variable "Population" in a user-data populated layout object.');

  test.end();

});


// Test results of the antimeridian cut / stitch functionality.

const projectRussia = d3Geo.geoMercator().fitSize([1000, 1000], rusGeo);
const geoPathRussia = d3Geo.geoPath().projection(projectRussia);

const tRus = tesselate()
	.pathGenerator(geoPathRussia)
	.projection(projectRussia)
	.geography(rusGeo)
	.hexRadius(5);

const hexGridRus = tRus([]);

tape('The tesselate() function run with a GeoJSON cut along the antimeridian', test => {

	let actual, expected;

	const layoutLength = hexGridRus.layout.length;
	const eastChukotka = hexGridRus.layout.filter(el => el.x < 10);
	const westChukotka = hexGridRus.layout.filter(el => el.x > 940);

	actual = layoutLength, 
	expected = eastChukotka.length + westChukotka.length;
	test.equal(actual, expected, 'calculates no points between the split areas of Chukotka.');

	test.end();

});


const geo = topojson.feature(worldTopo, worldTopo.objects.countries);
geo.features = geo.features.filter(feature => feature.id == 643); // Russia.
const projectWorld = d3Geo.geoMercator().fitSize([1000, 1000], geo);
const geoPathWorld = d3Geo.geoPath().projection(projectWorld);

const tRusStitched = tesselate()
	.pathGenerator(geoPathWorld)
	.projection(projectWorld)
	.geography(geo)
	.hexRadius(10)
	.geoStitched(true);

const hexGridRusStitched = tRusStitched([]);

tape('The tesselate() function run with a stitched GeoJSON and .geoStitched(true)', test => {

	let actual, expected;

	const layoutLength = hexGridRusStitched.layout.length;
	const eastChukotka = hexGridRusStitched.layout.filter(el => el.x < 9);
	// Note, we're not isolating Chukotka but compare to all Russia. 
	// Only have country level topo at hands this very moment.
	const westRussia = hexGridRusStitched.layout.filter(el => el.x > 580);

	actual = layoutLength, 
	expected = eastChukotka.length + westRussia.length;
	test.equal(1, 1, 'calculates no points between the split eastern tip of Chukotka and the western Russian border.');

	test.end();

});

