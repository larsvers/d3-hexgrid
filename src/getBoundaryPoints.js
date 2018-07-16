/**
 * Produce an array or arrays with all polygonal boundary points.
 * @param  {Object}   geo           The GeoJSON FeatureCollection.
 * @param  {function} projection    The D3 projection function.
 * @return {Array}                  Array of arrays holding the boundary points
 *                                  for each area.
 */
export default function(geo, projection) {
  let boundaryPoints = [];
  let collection;

  // 1) Try for geometry type and get their contents.

  try {
    if (geo.type === 'FeatureCollection') {
      collection = geo.features;
    } else if (geo.type === 'GeometryCollection') {
      collection = geo.geometries;
    } else {
      throw new Error(
        'Geometry type not supported. Please feed me a "FeatureCollection" or a "GeometryCollection".'
      );
    }
  } catch (err) {
    console.error(err);
  }

  // 2) Retrieve the boundary points.

  for (let i = 0; i < collection.length; i++) {
    // Crack open the geometry to the to the coordinate holder object.
    const geom =
      geo.type === 'FeatureCollection'
        ? geo.features[i].geometry
        : geo.geometries[i];

    // Different ways to access coordinates in a FeatureCollection:

    // Polygons: coordinates[Array[coordinates]]
    if (geom && geom.type === 'Polygon') {
      // Correcting for longitudes +180°.
      const polygon = geom.coordinates[0].map(coord =>
        projection(coord[0] > 180 ? [180, coord[1]] : coord)
      );
      boundaryPoints.push(polygon);

      // MultiPolygons: coordinates[Polygons[Array[[coordinates]]]]
    } else if (geom && geom.type === 'MultiPolygon') {
      // Correcting for longitudes +180°.
      const polygons = geom.coordinates.map(multi =>
        multi[0].map(coord =>
          projection(coord[0] > 180 ? [180, coord[1]] : coord)
        )
      );
      boundaryPoints = boundaryPoints.concat(polygons);
    } else {
      continue;
    }
  }

  return boundaryPoints;
}
