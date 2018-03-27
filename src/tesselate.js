import getGridPoints from './getGridPoints.js';
import getBoundaryPoints from './getBoundaryPoints.js';

export default function() {

	// Init exposed.
	let width,
			height,
			hexRadius;

	let geography,
			projection;

	// Main.
	const tess = function() {

debugger

		const gridPoints = getGridPoints(width, height, hexRadius);

		const boundaryPoints = getBoundaryPoints(geography, projection)


		return boundaryPoints;

	};


	// Exposed.
	tess.width = function(_) {
		return arguments.length ? (width = _, tess) : width;
	};

	tess.height = function(_) {
		return arguments.length ? (height = _, tess) : height;
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

