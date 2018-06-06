import { polygonContains } from 'd3-polygon';

/**
 * Produce an array or arrays with all points within a polygonial area/feature.
 * @param  {Array} gridPoints     		All grid points.
 * @param  {Array} boundaryPoints	 		Array of arrays, one for each area, 
 *                                   	holding the area's boundary points.
 * @return {Array}            				Array of grid points within each area. 
 *                                    Sorted ascendingly by x and y.
 */
export default function(gridPoints, boundaryPoints) {

	return boundaryPoints.reduce(function(result, boundary) {

		const areaPoints = gridPoints.filter(point => polygonContains(boundary, [point.x, point.y]));

		return result.concat(areaPoints);

	}, []).sort((a, b) => a.x - b.x || a.y - b.y);

}
