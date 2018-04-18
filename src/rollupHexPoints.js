/**
 * Roll up number of datapoints per hexagon and 
 * calculate maximum number of hex points.
 * @param  {Array} hexPoints 				Array of arrays of grid and 
 *                               		datapoints per hexagon.
 * @return {Array}            			Array of arrays of datapoints 
 *                                  per hexagon plus additional props.
 */
export default function(hexPoints) {

	// Init maximum prop.
	let maxHexPoints = 0;

	// Optimised decrementing loop as potentially many points.
	for (let i = hexPoints.length - 1; i >= 0; i--) {

		// Cache current element.
		const hexPoint = hexPoints[i];

		// Remove grid points.
		for (let j = hexPoint.length - 1; j >= 0; --j) {
			if (hexPoint[j].gridpoint == 1) {
				hexPoint.splice(j, 1);
			}
		}

		// Augment with new properties.
		hexPoints[i].datapoints = hexPoints[i].length;
		maxHexPoints = hexPoint.length > maxHexPoints ? hexPoint.length : maxHexPoints;

	}

	return { layout: hexPoints, maxHexPoints };

}
