/**
 * Defines the data's latitude and longitude keys.
 * @param  {Array} lonLat   User defined array of geo keys.
 * @param  {Array} data     User defined data.
 * @return {Array}          Array of geo keys.
 */
function checkLonLatNames(lonLat, data) {
  if (lonLat && lonLat.length === 2) return lonLat;

  const lonKey = Object.keys(data[0]).filter(key => {
    const low = key.toLowerCase();
    return (
      low === 'longitude' ||
      low === 'lon' ||
      low === 'lng' ||
      low === 'long' ||
      low === 'lambda'
    );
  });

  const latKey = Object.keys(data[0]).filter(key => {
    const low = key.toLowerCase();
    return low === 'latitude' || low === 'lat' || low === 'phi';
  });

  return [lonKey[0], latKey[0]];
}

/**
 * Process the user data to be structured for further use.
 * @param  {Array}    data          Array of user data objects.
 * @param  {function} projection    Geo projection.
 * @param  {Array}    variables     Optional. Array of variables the user
 *                                  would like to add to the layout.
 * @return {Array}                  Array of user's data points.
 */
export default function(data, projection, lonLat, variables) {
  // Return an empty array if the user hasn't passed down data.
  if (!data.length) return [];

  const geoKeys = checkLonLatNames(lonLat, data);

  return data.map(el => {
    const coords = projection([+el[geoKeys[0]], +el[geoKeys[1]]]);

    const obj = {};
    obj.x = coords[0];
    obj.y = coords[1];

    if (variables && variables.length) {
      variables.forEach(varName => {
        obj[varName] = el[varName];
      });
    }

    return obj;
  });
}
