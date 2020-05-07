import { geoCircle } from 'd3-geo';
import { getPixelRadius } from './utils';

/**
 * Sniffs the unit and converts to either "m" or "km".
 * @param   {string} unit The user given unit.
 * @return  {string}      The clean unit string.
 */
function getUnitString(unit) {
  let unitLower = unit.toLowerCase();

  if (unitLower === 'm' || unitLower === 'km') {
    return unitLower;
  } 
  if (
    unitLower === 'kilometres' ||
    unitLower === 'kilometre' ||
    unitLower === 'kilometers' ||
    unitLower === 'kilometer'
  ) {
    unitLower = 'km';
  } else if (unitLower === 'miles' || unitLower === 'mile') {
    unitLower = 'm';
  } else {
    throw new Error(
      'Please provide the unit identifier as either "km" for kilometres or "m" for miles'
    );
  }

  return unitLower;
}

/**
 *
 * @param   {number}    radiusDistance  The user given distance in either miles or km.
 * @param   {string}    distanceUnit    The user chosen distance unit (miles or km).
 * @param   {function}  projection      The D3 projection function.
 * @param   {Array}     center          The center coordinates of the drawing area.
 * @return  {Object}                    The geo circle, the radius in degrees and in pixel.
 */
export default function(radiusDistance, distanceUnit, projection, center) {
  // Get radius in degrees
  const unit = getUnitString(distanceUnit);
  const RADIUS_EARTH = unit === 'm' ? 3959 : 6371;
  const radiusRadians = radiusDistance / RADIUS_EARTH;
  const radiusDegrees = radiusRadians * (180 / Math.PI);

  // Get geo circle data.
  const circlePolygon = geoCircle()
    .radius(radiusDegrees)
    .center(projection.invert(center));

  // Get radius in pixel.
  const radiusPixel = getPixelRadius(circlePolygon(), projection);

  return { circlePolygon, radiusDegrees, radiusPixel };
}
