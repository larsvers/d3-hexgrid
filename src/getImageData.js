/**
 * Checks which pixel of the image are filled
 * returning pixel positions to draw hexes on.
 * @param  {Array}    size        Width and height of base element.
 * @param  {function} pathGen     D3 path generator function.
 * @param  {Object}   geo         GeoJSON representing the object to tesselate.
 * @param  {number}   r           Hexagon radius.
 * @param  {string}   action      Drawing action `fill` or `stroke`.
 * @param  {number}   band        Extension of image (factor of r).
 * @return {Uint8ClampedArray}  Array of A values (from RGBA) per pixel.
 */
// export default function(size, precision, pathGen, geo, r, action, band) {
export default function(size, pathGen, geo, r, action, band) {
  const gridExtentStroke = band * r;
  const edgeBand = gridExtentStroke + 2 * r;

  // For debugging; append the canvas to the body and just draw on it.
  const canvas = document.createElement('canvas');
  // const canvas = d3.select('body').append('canvas').node();
  [canvas.width, canvas.height] = size;

  const context = canvas.getContext('2d');

  const canvasPath = pathGen.context(context);

  // Draw.
  context.beginPath();
  canvasPath(geo);
  if (action === 'fill') {
    // debugger
    if (band) {
      context.lineWidth = gridExtentStroke;
      context.stroke();
    }
    context.fill();
  } else if (action === 'stroke') {
    context.lineWidth = edgeBand;
    context.stroke();
  }

  // Remove side effect of setting the path's context.
  pathGen.context(null);

  // Get the pixel rgba data but only keep the 4th value (alpha).
  const imgData = context.getImageData(0, 0, size[0], size[1]).data;
  return imgData.filter((d, i) => i % 4 === 3);
}
