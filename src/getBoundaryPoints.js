/**
 * Produces an array or arrays with all boundary points.
 * @param  {objcet} 	geo        		The geoJson featureCollection.
 * @param  {function} projection 		The d3 porjection function.
 * @return {Array}            			Array of arrays holding the boundary ponts for each area.
 */
export default function(geo, projection) {

	const featureCollection = geo.features[0].geometry.coordinates;

	return featureCollection.map(el => el[0].map(elt => projection(elt)));

}
