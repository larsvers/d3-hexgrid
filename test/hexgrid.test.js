// Libraries.
const tape = require('tape'),
  d3Geo = require('d3-geo'),
  JSDOM = require('jsdom').JSDOM,
  hexgrid = require('../').hexgrid;

// Data.
const luxGeo = require('./data/lux_adm0.json'),
  luxCities = require('./data/lux_cities.json');

// Helper functions.

/**
 * Check if all object properties are congruent.
 * @param  {Array} keyList  Array of properties for each object.
 * @return {boolean}        true for congruent properties • false for deviance.
 */
function getKeyEquality(keyList) {
  const keyEquality = [];
  for (let i = 0; i < keyList.length; i++) {
    if (i == 0) continue;
    var equality = keyList[i - 1].join() === keyList[i].join();
    keyEquality.push(equality);
  }
  return Array.from(new Set(keyEquality))[0];
}

/**
 * Get unique object properties across array.
 * @param  {Array} keys   Array of objects with keys to test.
 * @return {Array}        Array of unique keys.
 */
function getUniqueKeys(layout) {
  const allKeys = layout.reduce((res, el) => {
    return res.concat(Object.keys(el));
  }, []);

  return Array.from(new Set(allKeys));
}

// Fake dom for canvas methods using `document`.
const dom = new JSDOM('<!DOCTYPE html><title>fake dom</title>');
global.document = dom.window.document;

// Set up the hexgrid
const w = 100,
  h = 100,
  geo = luxGeo;

const projection = d3Geo.geoMercator().fitSize([w, h], luxGeo);
const geoPath = d3Geo.geoPath().projection(projection);

const t = hexgrid()
  .extent([w, h])
  .geography(geo)
  .projection(projection)
  .pathGenerator(geoPath)
  .hexRadius(4);

const hex = t([]);
const hexData = t(luxCities);
const hexDataWithKeys = t(luxCities, ['Name', 'Population']);

tape('The hexgrid function returns an object', test => {
  let actual, expected;

  (actual = hex.grid.constructor.name), (expected = 'Object');
  test.equal(actual, expected, 'called "grid".');

  (actual = hex.grid.layout.constructor.name), (expected = 'Array');
  test.equal(
    actual,
    expected,
    'with a property called "layout" of type "Array".'
  );

  (actual = hex.grid.imageCenters.constructor.name), (expected = 'Array');
  test.equal(
    actual,
    expected,
    'with a property called "imageCenters" of type "Array".'
  );

  (actual = hex.grid.extentPoints.constructor.name), (expected = 'Array');
  test.equal(
    actual,
    expected,
    'with a property called "extentPoints" of type "Array".'
  );

  (actual = hex.grid.extentPointsWeighted.constructor.name),
    (expected = 'Array');
  test.equal(
    actual,
    expected,
    'with a property called "extentPointsWeighted" of type "Array".'
  );

  (actual = hex.grid.extentPointDensity.constructor.name), (expected = 'Array');
  test.equal(
    actual,
    expected,
    'with a property called "extentPointDensity" of type "Array".'
  );

  test.end();
});

tape("The hexgrid's layout array holds objects", test => {
  let actual, expected;

  // Check all objects share the same keys.
  const layout = hex.grid.layout;
  const keyArray = layout.map(d => Object.keys(d));

  actual = getKeyEquality(keyArray);
  expected = true;
  test.equal(actual, expected, 'with the same properties.');

  // Check unique key names.
  const uniqueKeys = getUniqueKeys(layout);

  actual = uniqueKeys.length;
  expected = 7;
  test.equal(
    actual,
    expected,
    'with seven keys if no user data is passed through.'
  );

  expected = true;
  actual = uniqueKeys.includes('x');
  test.equal(actual, expected, 'with an "x" property.');
  actual = uniqueKeys.includes('y');
  test.equal(actual, expected, 'with a "y" property.');
  actual = uniqueKeys.includes('cover');
  test.equal(actual, expected, 'with a "cover" property.');
  actual = uniqueKeys.includes('gridpoint');
  test.equal(actual, expected, 'with a "gridpoint" property.');
  actual = uniqueKeys.includes('datapoints');
  test.equal(actual, expected, 'with a "datapoints" property.');
  actual = uniqueKeys.includes('datapointsWt');
  test.equal(actual, expected, 'with a "datapointsWt" property.');
  actual = uniqueKeys.includes('pointDensity');
  test.equal(actual, expected, 'with a "pointDensity" property.');

  test.end();
});

tape('The hexgrid function run with a geography returns an object', test => {
  let actual, expected;

  actual = hex.grid.layout.length > 90;
  expected = true;
  test.equal(
    actual,
    expected,
    'with a "layout" array of length greater than the expected number.'
  );

  actual = hex.grid.imageCenters.length > 90;
  expected = true;
  test.equal(
    actual,
    expected,
    'with an "imageCenters" array of length greater than the expected number.'
  );

  test.end();
});

tape(
  'The hexgrid function run with a geography and user data returns an object',
  test => {
    let actual, expected;

    actual = hexData.grid.extentPoints[0];
    expected = 1;
    test.equal(
      actual,
      expected,
      'with the expected minimum of datapoints per hexagon.'
    );

    actual = hexData.grid.extentPoints[1];
    expected = 1;
    test.equal(
      actual,
      expected,
      'with the expected maximum of datapoints per hexagon.'
    );

    // Check length of hexagons with datapoints.
    const layout = hexData.grid.layout;
    const points = layout.filter(d => d.datapoints).map(d => d.length > 0);
    let length = Array.from(new Set(points))[0];

    actual = length;
    expected = true;
    test.equal(
      actual,
      expected,
      'with a "layout" property holding hexagons with a length greater than 0 if they contain datapoints.'
    );

    // Check lengthh of hexagons without datapoints.
    const noPoints = layout.filter(d => !d.datapoints).map(d => d.length > 0);
    length = Array.from(new Set(noPoints))[0];

    actual = length;
    expected = false;
    test.equal(
      actual,
      expected,
      'with a "layout" property holding hexagons with a length of 0 if they do not contain datapoints.'
    );

    // Check cover of external hexagons.
    const edges = layout
      .filter(d => d.cover < 1 && d.datapoints)
      .map(d => d.datapointsWt > d.datapoints);

    actual = Array.from(new Set(edges))[0];
    expected = true;
    test.equal(
      actual,
      expected,
      'with a "layout" property holding edge hexagons with up-weighted datapoints.'
    );

    // Check cover of internal hexagons.
    const internal = layout
      .filter(d => d.cover === 1 && d.datapoints)
      .map(d => d.datapointsWt === 1);

    actual = Array.from(new Set(edges))[0];
    expected = true;
    test.equal(
      actual,
      expected,
      'with a "layout" property holding internal hexagons with no up-weighted datapoints.'
    );

    test.end();
  }
);

tape(
  'Given a geography, user data and user variables, only the layout objects WITH datapoints',
  test => {
    let actual, expected;

    // Check user variables have been passed through.
    const filter = hexDataWithKeys.grid.layout.filter(d => d.datapoints);
    const keyArray = filter.map(d => Object.keys(d));

    actual = getKeyEquality(keyArray);
    expected = true;
    test.equal(actual, expected, 'share the same properties.');

    // Check unique key names.
    const uniqueKeys = getUniqueKeys(filter);

    actual = uniqueKeys.length;
    expected = 8;
    test.equal(
      actual,
      expected,
      'have eight keys (all keys + Array index 0) if the maximum number of datapoints per hex is 1.'
    );

    // Check equality of key names.
    const datapointKeyArray = filter.map(d => Object.keys(d[0]));

    actual = getKeyEquality(datapointKeyArray);
    expected = true;
    test.equal(
      actual,
      expected,
      'hold datapoint objects with the same properties.'
    );

    // Check unique key names.
    const datapoints = filter.map(d => d[0]);
    const datapointsUniqueKeys = getUniqueKeys(datapoints);

    actual = datapointsUniqueKeys.length;
    expected = 4;
    test.equal(
      actual,
      expected,
      'hold datapoint objects with the expected number of properties.'
    );

    expected = true;
    actual = datapointsUniqueKeys.includes('x');
    test.equal(
      actual,
      expected,
      'hold datapoint objects with an "x" property.'
    );
    actual = datapointsUniqueKeys.includes('y');
    test.equal(actual, expected, 'hold datapoint objects with a "y" property.');
    actual =
      datapointsUniqueKeys.includes('Name') &&
      datapointsUniqueKeys.includes('Population');
    test.equal(
      actual,
      expected,
      'hold datapoint objects with the passed in user variables.'
    );

    test.end();
  }
);

const tM = hexgrid()
  .extent([w, h])
  .geography(geo)
  .projection(projection)
  .pathGenerator(geoPath)
  .hexRadius(50, 'm');

const tKm = hexgrid()
  .extent([w, h])
  .geography(geo)
  .projection(projection)
  .pathGenerator(geoPath)
  .hexRadius(50, 'km');

const radiusM = tM([]).radius();
const radiusKm = tKm([]).radius();

tape('Given a user defined distance unit', test => {
  let actual, expected;

  // const radiusM = hexUnitM.radius();
  // const radiusKm = hexUnitKm.radius();

  actual = typeof radiusM;
  expected = 'number';

  test.equal(actual, expected, 'the converted radius should be a number.');

  actual = radiusM;
  expected = 102;

  test.equal(
    actual,
    expected,
    'the converted radius should be the expected number.'
  );

  actual = radiusM > radiusKm;
  expected = true;

  test.equal(
    actual,
    expected,
    'the converted miles radius should be larger than the converted km radius.'
  );

  test.end();

  console.log(actual, expected);
});
