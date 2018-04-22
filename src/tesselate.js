import getGridPoints from './getGridPoints.js';
import getBoundaryPoints from './getBoundaryPoints.js';
import getPolygonGridPoints from './getPolygonGridPoints.js';
import getGeoOutline from './getGeoOutline.js';
import getGeoGridPoints from './getGeoGridPoints.js';
import getHexGenerator from './getHexGenerator.js';
import processUserData from './processUserData.js';
import rollupHexPoints from './rollupHexPoints.js';

export default function() {

	// Init exposed.
	let geography,
			projection,
			pathGenerator,
			hexRadius,
			geoStitched = false;

	// Main.
	const tess = function(userData, userVariables) {

		debugger

		const gridPoints = getGridPoints(geography, projection, pathGenerator, hexRadius);

		let areaGridPoints;

		if (!geoStitched) {

			const boundaryPoints = getBoundaryPoints(geography, projection);
			areaGridPoints = getPolygonGridPoints(gridPoints, boundaryPoints);

		} else {

			const geoGridPoints = getGeoOutline(pathGenerator, gridPoints);
			areaGridPoints = getGeoGridPoints(geoGridPoints, geography, projection);

		}
		
		const userDataPoints = processUserData(userData, projection, userVariables);

		const mergedData = areaGridPoints.concat(userDataPoints);

		const hexGenerator = getHexGenerator(hexRadius);

		const hexPoints = hexGenerator(mergedData);

		const rolledUpHexPoints = rollupHexPoints(hexPoints);


		// Additional outputs.
		hexGenerator.grid = gridPoints;
		// hexGenerator.geoGrid = geoGridPoints ? geoGridPoints : [];
		hexGenerator.areaGrid = areaGridPoints;

		// Key outputs.
		hexGenerator.layout = rolledUpHexPoints.layout;
		hexGenerator.maximum = rolledUpHexPoints.maxHexPoints;

		return hexGenerator;

	};


	// Exposed.
	tess.geography = function(_) {
		return arguments.length ? (geography = _, tess) : geography;
	};

	tess.projection = function(_) {
		return arguments.length ? (projection = _, tess) : projection;
	};

	tess.pathGenerator = function(_) {
		return arguments.length ? (pathGenerator = _, tess) : pathGenerator;
	};

	tess.hexRadius = function(_) {
		return arguments.length ? (hexRadius = _, tess) : hexRadius;
	};

	tess.geoStitched = function(_) {
		return arguments.length ? (geoStitched = _, tess) : geoStitched;
	};


	return tess;

};

