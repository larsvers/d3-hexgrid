import getGridPoints from './getGridPoints.js';
import getBoundaryPoints from './getBoundaryPoints.js';
import getAreaGridPoints from './getAreaGridPoints.js';
import getHexGenerator from './getHexGenerator.js';
import processUserData from './processUserData.js';
import rollupHexPoints from './rollupHexPoints.js';

export default function() {

	// Init exposed.
	let size,
			hexRadius,
			geography,
			projection;

	// Main.
	const tess = function(userData, userVariables) {

		const [width, height] = size;

		const gridPoints = getGridPoints(width, height, hexRadius);

		const boundaryPoints = getBoundaryPoints(geography, projection);

		const areaGridPoints = getAreaGridPoints(gridPoints, boundaryPoints);

		const userDataPoints = processUserData(projection, userData, userVariables);

		const mergedData = areaGridPoints.concat(userDataPoints);

		const hexGenerator = getHexGenerator(hexRadius);

		const hexPoints = hexGenerator(mergedData);

		const rolledUpHexPoints = rollupHexPoints(hexPoints);

		hexGenerator.layout = rolledUpHexPoints.layout;
		hexGenerator.maxHexPoints = rolledUpHexPoints.maxHexPoints;

		return hexGenerator;

	};


	// Exposed.
	tess.size = function(_) {
		return arguments.length ? (size = _, tess) : size;
	};

	tess.hexRadius = function(_) {
		return arguments.length ? (hexRadius = _, tess) : hexRadius;
	};

	tess.geography = function(_) {
		return arguments.length ? (geography = _, tess) : geography;
	};

	tess.projection = function(_) {
		return arguments.length ? (projection = _, tess) : projection;
	};


	return tess;


};

