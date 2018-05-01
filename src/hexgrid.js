import getGridPoints from './getGridPoints.js';
import getBoundaryPoints from './getBoundaryPoints.js';
import getPolygonPoints from './getPolygonPoints.js';
import getGeoOutline from './getGeoOutline.js';
import getGeoPoints from './getGeoPoints.js';
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
	const hexgrid = function(userData, userVariables) {
		// debugger

		const gridPoints = getGridPoints(
			geography,
			projection,
			pathGenerator,
			hexRadius
		);

		let areaGridPoints;

		if (!geoStitched) {
			const boundaryPoints = getBoundaryPoints(geography, projection);
			areaGridPoints = getPolygonPoints(gridPoints, boundaryPoints);
		} else {
			const geoGridPoints = getGeoOutline(pathGenerator, gridPoints);
			areaGridPoints = getGeoPoints(geoGridPoints, geography, projection);
		}

		const userDataPoints = processUserData(userData, projection, userVariables);

		const mergedData = areaGridPoints.concat(userDataPoints);

		const hexGenerator = getHexGenerator(hexRadius);

		const hexPoints = hexGenerator(mergedData);

		const rolledUpHexPoints = rollupHexPoints(hexPoints);

		// Additional outputs.
		// hexGenerator.grid = gridPoints;
		// hexGenerator.geoGrid = geoGridPoints ? geoGridPoints : [];
		// hexGenerator.areaGrid = areaGridPoints;
		// hexGenerator.userDataPoints = userDataPoints;
		hexGenerator.getBoundaryPoints = getBoundaryPoints;
		hexGenerator.getPolygonPoints = getPolygonPoints;

		// Key outputs.
		hexGenerator.layout = rolledUpHexPoints.layout;
		hexGenerator.maximum = rolledUpHexPoints.maxHexPoints;

		return hexGenerator;
	};

	// Exposed.
	hexgrid.geography = function(_) {
		return arguments.length ? ((geography = _), hexgrid) : geography;
	};

	hexgrid.projection = function(_) {
		return arguments.length ? ((projection = _), hexgrid) : projection;
	};

	hexgrid.pathGenerator = function(_) {
		return arguments.length ? ((pathGenerator = _), hexgrid) : pathGenerator;
	};

	hexgrid.hexRadius = function(_) {
		return arguments.length ? ((hexRadius = _), hexgrid) : hexRadius;
	};

	hexgrid.geoStitched = function(_) {
		return arguments.length ? ((geoStitched = _), hexgrid) : geoStitched;
	};

	return hexgrid;
}
