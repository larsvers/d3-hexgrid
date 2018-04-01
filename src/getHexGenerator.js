import { hexbin } from 'd3-hexbin';

/**
 * Creates a configured instance of the hexbin generator.
 * @param  {Array} areaPoints     	Array of grid points within each defined area.
 * @param  {number} radius	 				Raidus in pixel.
 * @return {Function}            		Hexgin generator function.
 */
export default function(radius) {

	const hexbinGenerator = hexbin()
		.radius(radius)
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });

	return hexbinGenerator;

}