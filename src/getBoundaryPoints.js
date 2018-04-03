/**
 * Produces an array or arrays with all boundary points.
 * @param  {Object} 	geo        		The geoJson featureCollection.
 * @param  {function} projection 		The d3 porjection function.
 * @return {Array}            			Array of arrays holding the boundary ponts for each area.
 */
export default function(geo, projection) {

	const featureCollection = geo.features[0].geometry.coordinates;

	return featureCollection.map(feature => feature[0].map(coord => projection(coord)));

}
