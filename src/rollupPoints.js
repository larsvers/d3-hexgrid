/**
 * Roll up number of datapoints per hexagon, 
 * add cover and calculate maximum number of hex points.
 * @param  {Array} hexPoints 				Array of arrays of grid and 
 *                               		datapoints per hexagon.
 * @return {Array}            			Array of arrays of datapoints 
 *                                  per hexagon plus additional props.
 */
export default function(hexPoints) {

	// Init maximum prop.
	// let maximumPoints = 0;

	// Optimised decrementing loop as potentially many points.
	for (let i = hexPoints.length - 1; i >= 0; i--) {

		// Cache current element and prep cover variable.
		const hexPoint = hexPoints[i];
    let cover, gridpoint;

		// Remove grid points and cache cover.
		for (let j = hexPoint.length - 1; j >= 0; --j) {
			if (hexPoint[j].gridpoint == 1) {
        cover = hexPoint[j].cover;
        gridpoint = 1;
				hexPoint.splice(j, 1);
			}
		}

		// Augment with new properties.
    hexPoints[i].datapoints = hexPoints[i].length;
    hexPoints[i].cover = cover;
		hexPoints[i].gridpoint = gridpoint || 0;
		// maximumPoints = hexPoint.length > maximumPoints ? hexPoint.length : maximumPoints;

	}

  // return { layout: hexPoints, maximumPoints };
	return hexPoints;

}
