/**
 * Bring each hexpoint into shape, by rolling up number of datapoints
 * per hexagon, add cover and setting apart original centers from
 * centers added by user-data.
 * @param  {Array} hexPoints        Array of arrays of grid and
 *                                  datapoints per hexagon.
 * @return {Array}                  Array of arrays of datapoints
 *                                  per hexagon plus additional props.
 */
export default function(hexPoints) {
  for (let i = 0; i < hexPoints.length; i++) {
    // Cache current element and prep cover variable.
    const hexPoint = hexPoints[i];
    let cover;
    let gridpoint;

    // Remove grid points and cache cover.
    for (let j = 0; j < hexPoint.length; j++) {
      if (hexPoint[j].gridpoint === 1) {
        cover = hexPoint[j].cover;
        gridpoint = 1;
        hexPoint.splice(j, 1);
      }
    }

    // Augment with new properties.
    hexPoints[i].datapoints = hexPoints[i].length;
    hexPoints[i].cover = cover;
    hexPoints[i].gridpoint = gridpoint || 0;
  }

  return hexPoints;
}
