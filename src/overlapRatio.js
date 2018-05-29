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
  context.strokeStyle = colour;
  context.stroke();
}




export default function (edge, tools, precision) {

  const {canvasHex, canvasImage, contextMix} = tools;
  const w = canvasHex.width;
  const h = canvasHex.height;

  // // Debug ↓ ---------------------

  // const r = 7;
  // const hexCorners = Array(7);
  // for (let i = 0; i < 7; i++) {
  //   const corner = pointyHexCorner(edge, r * precision, i);
  //   hexCorners.push(corner);
  // }

  // const contextImage = canvasImage.getContext('2d');

  // // Centers.
  // contextImage.beginPath();
  //   contextImage.arc(edge.x, edge.y, 2, 0, 2*Math.PI)
  // contextImage.fillStyle = '#000'
  // contextImage.fill();

  // // Hexagons
  // hexDraw(contextImage, hexCorners, 'red')

  // // Debug ↑ ---------------------

  // 1) Concoct the specific edge hesagon image and get the pixel data.

  // Draw hex image.
  contextMix.drawImage(canvasHex, 0, 0);

  // Set the composite type in preperation for the image overlap.
  contextMix.globalCompositeOperation = 'source-atop';

  // Draw Map at correct position.
  contextMix.drawImage(
    canvasImage,
    -edge.x*precision + w/2,
    -edge.y*precision + h/2
  );  

  // Get the image data.
  const imageData = contextMix.getImageData(0,0,w,h).data;

  // Clear the canvas and Reset the composite type in preperation 
  // for the next overlap (http://bit.do/ekDx4).
  contextMix.clearRect(0,0,w,h);
  contextMix.globalCompositeOperation = 'source-over';


  // 2) Calculate the image cover per edge hexagon.

  // Init area count variables.
  let hexArea = 0, 
      imgArea = 0;

  // Find filled pixel with some alpha (>=100)
  // and identify image part.
  for (var pixelIndex = 3; pixelIndex < imageData.length; pixelIndex+=4) {
    const alpha = imageData[pixelIndex];
    if (alpha < 100) {
      continue
    } else {
      const red = imageData[pixelIndex-3];
      const blue = imageData[pixelIndex-1];
      red > blue ? hexArea++ : imgArea++;
    } 
  }

  // Calculate cover and add to edge hexagon.
  const imgRatio = imgArea / (hexArea + imgArea);
  const updatedEdge = Object.assign({}, edge);
  updatedEdge.cover = imgRatio;


  return updatedEdge;


}