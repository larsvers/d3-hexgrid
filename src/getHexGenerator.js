import { hexbin } from 'd3-hexbin';

/**
 * Produces an array or arrays with all points within an area.
 * @param  {Array} gridPoints     	All grid points.
 * @param  {Array} boundaryPoints	 	Array of arrays, one for each area, holding the area's boundary points.
 * @return {Array}            			Array of grid points within each area defined by boundaryPoints.
 */
export default function(areaPoints, radius) {

	const hexbinGenerator = hexbin()
		.radius(radius)
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });

	return hexbinGenerator;

}