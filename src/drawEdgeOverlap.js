
/**
 * Produce corner points for a pointy hexagon.
 * @param  {Object} center Hexagon center position.
 * @param  {number} r      Radius of hexagon.
 * @param  {number} i      Index of point to calculate.
 * @return {Object}        Hexagon corner position.
 */
function pointyHexCorner(center, r, i) {
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
 * @param  {String} colour  Fill colour.
 * @return {[type]}         undefined
 */
function hexDraw(context, corners, colour) {
  context.beginPath();
  corners.forEach(d => {
    d === 0 
      ? context.moveTo(d.x, d.y)
      : context.lineTo(d.x, d.y);
  });
  context.closePath();
  context.fillStyle = colour;
  context.fill();
}


export default function(precision, size, geoPath, geo, r) {

  // 1) Draw a hex with the correct radius at 0, 0.

  // Set up canvas and context.
  const w = Math.sqrt(3) * r * precision
  const h = r * 2 * precision;
  // const w = 500
  // const h = 500;
  const canvasHex = document.createElement('canvas');
  canvasHex.width = w; canvasHex.height = h;
  // const canvasHex = d3.select('body').append('canvas')
    // .attr('width', w).attr('height', h).node()
  const contextHex = canvasHex.getContext('2d');

  // Get the hexagon's corner points.
  const hexCorners = Array(7);
  for (let i = 0; i < 7; i++) {
    const corner = pointyHexCorner({ x: 0, y: 0 }, r * precision, i);
    hexCorners.push(corner);
  }

  // Draw the hexagon.
  contextHex.translate(w/2,h/2)
  hexDraw(contextHex, hexCorners, 'red');


  // 2) Draw the image.

  // Set up the image canvas and context.
  const [width, height] = size;
  const canvasImage = document.createElement('canvas')
  canvasImage.width = width * precision; 
  canvasImage.height = height * precision;
  // const canvasImage = d3.select('body').append('canvas')
  //   .attr('width', width * precision).attr('height', height * precision)
  //   .node();
  const contextImage = canvasImage.getContext('2d');
  
  // Set geoPath's context.
  geoPath.context(contextImage);

  // Draw the image.
  contextImage.scale(precision, precision)
  contextImage.beginPath();
    geoPath(geo);
    contextImage.fillStyle = 'blue';
  contextImage.fill();

  // Reset geoPath's context.
  geoPath.context(null);


  // 3) Create context to combine images;

  // const contextMix = d3.select('body').append('canvas')
  //   .attr('width', w).attr('height', h).node().getContext('2d');
  const canvasMix = document.createElement('canvas');
  canvasMix.width = w;
  canvasMix.height = h;
  const contextMix = canvasMix.getContext('2d');


  return { canvasHex, canvasImage, contextMix };

}