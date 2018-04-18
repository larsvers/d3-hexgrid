import { hexbin } from 'd3-hexbin';

/**
 * Create a configured instance of the hexbin generator.
 * @param  {number} 	radius	 			Radius in pixel.
 * @return {function}            		Hexbin generator function.
 */
export default function(radius) {

	return hexbin()
		.radius(radius)
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });

}
