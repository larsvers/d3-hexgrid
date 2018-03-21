import getGridPoints from './getGridPoints.js'

export default function() {

	// Init exposed.
	var width,
			height,
			hexRadius;


	// Main.
	const tess = function() {

		const gridPoints = getGridPoints(width, height, hexRadius)

		return gridPoints;

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


	return tess;


};

