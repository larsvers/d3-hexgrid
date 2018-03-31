import { polygonContains } from 'd3-polygon';

/**
 * Produces an array or arrays with all points within an area.
 * @param  {Array} gridPoints     	All grid points.
 * @param  {Array} boundaryPoints	 	Array of arrays, one for each area, holding the area's boundary points.
 * @return {Array}            			Array of grid points within each area defined by boundaryPoints.
 */
export default function(gridPoints, boundaryPoints) {

	return boundaryPoints.reduce(function(areaPointArray, boundary) {

		var areaPoints = gridPoints.filter(point => polygonContains(boundary, [point.x, point.y]));

		return areaPointArray.concat(areaPoints);

	}, []).sort((a, b) => a.x - b.x || a.y - b.y);

}
