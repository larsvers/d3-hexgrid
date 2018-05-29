/**
 * Checks which pixel of the image are filled
 * returning pixel positions to draw hexes on.
 * @param  {Array} size         Width and height of base element.
 * @param  {number} precision   Ratio of original size to scale hidden canvas.
 * @param  {function} pathGen   D3 path generator function.
 * @param  {Object} geo         GeoJSON representing the object to tesselate.
 * @param  {number} r           Hexagon radius.
 * @param  {string} action      Drawing action `fill` or `stroke`.
 * @return {Uint8ClampedArray}  Array of B values (from RGBA) per pixel.
 */
export default function(size, precision, pathGen, geo, r, action) {

  const canvas = document.createElement('canvas');
  // const canvas = d3.select('body').append('canvas').node();
  canvas.width = size[0] * precision, canvas.height = size[1] * precision;

  const context = canvas.getContext('2d');
  context.scale(precision, precision);

  const canvasPath = pathGen.context(context);
  
  // Fill.
  context.beginPath();
    canvasPath(geo);
  if (action === 'fill' ) {
    context.fill()
  } else if (action === 'stroke') {
    context.lineWidth = 2 * r;
    context.stroke();
  }
    
  // Remove side effect of setting the path's context.
  pathGen.context(null); 
  
  // Get the pixel rgba data but only keep the 4th value (alpha).
  const imgData = context.getImageData(0, 0, size[0], size[1]).data;
  return imgData.filter((d,i) => i%4 === 3);

}

// For debugging; append the canvas to the body and just draw on it.