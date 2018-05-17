import { clampPrecision } from './utils'

import setHexGenerator from './setHexGenerator';
import getImageData from './getImageData';
import getImageCenters from './getImageCenters';

import processUserData from './processUserData';
import rollupHexPoints from './rollupHexPoints';



export default function() {

	// Init exposed.
	let extent,
    geography,
		projection,
		pathGenerator,
		hexRadius = 4,
		precision = 1;

	// Main.
	const hexgrid = function(userData, userVariables) {
    
    // debugger
    
    const hexbin = setHexGenerator(extent, hexRadius);

    const size = hexbin.size();

    const centers = hexbin.centers();

    const imageData = getImageData(size, precision, pathGenerator, geography);

    const imageCenters = getImageCenters(centers, imageData, size, precision);

		const userDataPoints = processUserData(userData, projection, userVariables);

		const mergedData = imageCenters.concat(userDataPoints);

		const hexPoints = hexbin(mergedData);

		const rolledUpHexPoints = rollupHexPoints(hexPoints);

		hexbin.layout = rolledUpHexPoints.layout;
		hexbin.maximum = rolledUpHexPoints.maxHexPoints;
    hexbin.imageCenters = imageCenters;

		return hexbin;

	};

	// Exposed.
  hexgrid.extent = function(_) {
    return arguments.length ? ((extent = _), hexgrid) : extent;
  };

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

	hexgrid.precision = function(_) {
		return arguments.length ? ((precision = clampPrecision(_)), hexgrid) : precision;
	};

	return hexgrid;
}
