import { geoContains } from 'd3-geo';

/**
 * Produce an array or arrays with all points within a geographic area/feature.
 * @param  {Array} 		gridPoints     	All grid points.
 * @param  {Array} 		geography	 			GeoJSON representing the geography.
 * @param  {function} projection 			The D3 projection function.
 * @return {Array}            				Array of grid points within each area. Sorted ascendingly by x and y.
 */
export default function(gridPoints, geography, projection) {

	return gridPoints.filter(point => geoContains(geography, projection.invert([point.x, point.y])));

}
