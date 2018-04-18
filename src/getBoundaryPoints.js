/**
 * Produce an array or arrays with all boundary points.
 * @param  {Object} 	geo        		The GeoJSON FeatureCollection.
 * @param  {function} projection 		The D3 projection function.
 * @return {Array}            			Array of arrays holding the boundary points 
 *                                  for each area.
 */
export default function(geo, projection) {
	
	let boundaryPoints = [];

	for (let i = 0; i < geo.features.length; i++) {
		
		const geom = geo.features[i].geometry;

		// Different ways to access coordinates in a FeatureCollection:

		// Polygons: coordinates[Array[coordinates]]
		if (geom && geom.type === 'Polygon') {

			// Correcting for longitudes +180°.
			const polygon = geom.coordinates[0].map(coord => projection(coord[0] > 180 ? [180, coord[1]] : coord));
			boundaryPoints.push(polygon);

		// MultiPolygons: coordinates[Polygons[Array[[coordinates]]]]
		} else if (geom && geom.type === 'MultiPolygon') {

			// Correcting for longitudes +180°.
			const polygons = geom.coordinates.map(multi => multi[0].map(coord => projection(coord[0] > 180 ? [180, coord[1]] : coord)));
			boundaryPoints = boundaryPoints.concat(polygons);

		} else {
			continue;
		}

	}

	return boundaryPoints;

}
