import getGridPoints from './getGridPoints.js';
import getBoundaryPoints from './getBoundaryPoints.js';
import getPointsInBoundaries from './getPointsInBoundaries.js';
import getHexGenerator from './getHexGenerator.js';

export default function() {

	// Init exposed.
	let size,
			hexRadius;

	let geography,
			projection;

	// Main.
	const tess = function() {

		const [width, height] = size;

		const gridPoints = getGridPoints(width, height, hexRadius);

		const boundaryPoints = getBoundaryPoints(geography, projection);

		const pointsInBoundaries = getPointsInBoundaries(gridPoints, boundaryPoints);

		const hexGenerator = getHexGenerator(pointsInBoundaries, hexRadius);

		const layout = hexGenerator(pointsInBoundaries);

		hexGenerator.layout = layout;

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

