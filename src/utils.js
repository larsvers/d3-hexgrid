
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
  const angleRadian = Math.PI / 180 * angleDegree;
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
    d === 0 
      ? context.moveTo(d.x, d.y)
      : context.lineTo(d.x, d.y);
  });
  context.closePath();
  if (action === 'fill') {    
    context.fillStyle = colour;
    context.fill();
  } else if (action === 'stroke') {    
    context.strokeStyle = colour;
    context.stroke();
  } else {
    throw new Error('hexDraw action needs to be either \'fill\' or \'stroke\'');
  }
}
