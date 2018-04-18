import { geoGraticule } from 'd3-geo';
import { polygonContains } from 'd3-polygon';

// String helper.
function keepDigits(str) {
	return str.replace(/[^0-9\.]/g, "");
}

/**
 * Keep only the gridpoints within the projected coordinates.
 * @param  {function} geoPath					Path generator.
 * @param  {Array} 		gridPoints     	All grid points.
 * @return {Array}            				Array of grid points within the full 
 *                                    projected area the geography covers.
 */
export default function(geoPath, gridPoints){

	const outline = geoGraticule().outline();

	const svgPath = geoPath(outline);

	// Note, a for loop implmentation is ~0.2ms quicker
	// but the chained syntax is ~10s faster to comprehend.
	const coords = svgPath
		.split(/(?=[LMC])/)
		.map(el => el.split(','))
		.map(el => [+keepDigits(el[0]), +keepDigits(el[1])]);

	const geoGridPoints = gridPoints.filter(p => polygonContains(coords, [p.x, p.y]));

	return geoGridPoints;

}






