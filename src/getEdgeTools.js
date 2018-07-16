import { pointyHexCorner, hexDraw } from './utils';

/**
 * Produe the canvas image of a specifically sized and scaled hexagon,
 * the canvas image of the desired base image as well as a context
 * to concoct the overlap image.
 * @param  {number}   precision   Scale for single hexagon-map image.
 * @param  {Array}    size        Width and height of base element.
 * @param  {function} pathGen     D3 path generator function.
 * @param  {Object}   geo         GeoJSON representing the object to tesselate.
 * @param  {number}   r           Hexagon radius.
 * @param  {number}   band        Extension of image (factor of r).
 * @return {Object}               The hex & geo image plus the context to use.
 */
export default function(precision, size, pathGen, geo, r, band) {
  // 1) Draw a hex with the correct radius at 0, 0.

  // Set up canvas and context.
  const w = Math.sqrt(3) * r * precision;
  const h = r * 2 * precision;
  const canvasHex = document.createElement('canvas');
  // const canvasHex = d3.select('body').append('canvas').node()
  canvasHex.width = w;
  canvasHex.height = h;
  const contextHex = canvasHex.getContext('2d');

  // Get the hexagon's corner points.
  const hexCorners = Array(7);
  for (let i = 0; i < 7; i++) {
    const corner = pointyHexCorner({ x: 0, y: 0 }, r * precision, i);
    hexCorners[i] = corner;
  }

  // Draw the hexagon.
  contextHex.translate(w / 2, h / 2);
  hexDraw(contextHex, hexCorners, 'red', 'fill');

  // 2) Draw the image.

  // Set up the image canvas and context.
  const [width, height] = size;
  const canvasImage = document.createElement('canvas');
  // const canvasImage = d3.select('body').append('canvas').node();
  canvasImage.width = width * precision;
  canvasImage.height = height * precision;
  const contextImage = canvasImage.getContext('2d');

  // Set the context for the path generator for use with Canvas.
  pathGen.context(contextImage);

  // Draw the image.
  const gridExtentStroke = band * r;

  contextImage.scale(precision, precision);
  contextImage.beginPath();
  pathGen(geo);
  contextImage.lineWidth = gridExtentStroke;
  contextImage.fillStyle = 'blue';
  contextImage.strokeStyle = 'blue';
  contextImage.stroke();
  contextImage.fill();

  // Reset the pathGenerators context.
  pathGen.context(null);

  // 3) Create context to combine images;

  const canvasMix = document.createElement('canvas');
  // const canvasMix = d3.select('body').append('canvas').node()
  canvasMix.width = w;
  canvasMix.height = h;
  const contextMix = canvasMix.getContext('2d');

  return { canvasHex, canvasImage, contextMix };
}
