/* eslint-disable no-param-reassign */

import { extent } from 'd3-array';

/**
 * Checks and if required converts the 1D extent to a 2D extent.
 * @param {Array} userExtent  Either the full 2D extent or just width and height.
 * @return                    The full 2D extent.
 */
export function expandExtent(userExtent) {
  const nestedArrayLength = Array.from(
    new Set(userExtent.map(e => e.length))
  )[0];
  let extentLong = Array(2);

  if (nestedArrayLength === 2) {
    extentLong = userExtent;
  } else if (nestedArrayLength === undefined) {
    extentLong = [[0, 0], userExtent];
  } else {
    throw new Error(
      "Check 'extent' is in the anticipated form [[x0,y0],[x1,y1]] or [x1,y1]"
    );
  }

  return extentLong;
}

/**
 * Checks and sets given value to greater than 0.
 * @param  {number} v       Value.
 * @param  {string} name    Value name.
 * @return {number}         Value.
 */
export function convertToMin(v, name, min) {
  if (v >= min) {
    return v;
  }
  // eslint-disable-next-line no-console
  console.warn(`${name} should be ${min} or greater. Coerced to ${min}.`);
  return min;
}

/**
 * Produce corner points for a pointy hexagon.
 * @param  {Object} center Hexagon center position.
 * @param  {number} r      Radius of hexagon.
 * @param  {number} i      Index of point to calculate.
 * @return {Object}        Hexagon corner position.
 */
export function pointyHexCorner(center, r, i) {
  const point = {};
  const angleDegree = 60 * i - 30;
  const angleRadian = (Math.PI / 180) * angleDegree;
  point.x = center.x + r * Math.cos(angleRadian);
  point.y = center.y + r * Math.sin(angleRadian);
  return point;
}

/**
 * Draw a hexagon.
 * @param  {Object} context The canvas context.
 * @param  {Object} corners Hexagon corner positions.
 * @param  {String} action  'fill' or 'stroke'.
 * @param  {String} colour  Colour.
 * @return {[type]}         undefined
 */
export function hexDraw(context, corners, colour, action = 'fill') {
  context.beginPath();
  corners.forEach(d => {
    d === 0 ? context.moveTo(d.x, d.y) : context.lineTo(d.x, d.y);
  });
  context.closePath();
  if (action === 'fill') {
    context.fillStyle = colour;
    context.fill();
  } else if (action === 'stroke') {
    context.strokeStyle = colour;
    context.stroke();
  } else {
    throw new Error("hexDraw action needs to be either 'fill' or 'stroke'");
  }
}

/**
 * Calculates the circle radius in pixel, given a circle polygon.
 * @param   {Object}    geoCirclePolygon  The circle polygon.
 * @param   {function}  projection        The D3 projection function.
 * @return  {number}                      The radius in pixel.
 */
export function getPixelRadius(geoCirclePolygon, projection) {
  // Get radius in pixel.
  const circleDataGeo = geoCirclePolygon.coordinates[0];
  const circleDataY = circleDataGeo.map(d => projection(d)[1]);
  const circleDiameter = extent(circleDataY);
  const radiusPixel = (circleDiameter[1] - circleDiameter[0]) / 2;

  return radiusPixel;
}
