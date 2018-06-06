
// // Debug
// import { pointyHexCorner, hexDraw } from './utils';


/**
 * Calculates the cover for a single hexagon by 
 * overlaying the map at the given position. 
 * @param  {Object} edge      The datum representing the edge center.
 * @param  {Object} tools     The image and drawing tools 
 *                            to create the overlap image.
 * @param  {number} precision The scaling factor for the image 
 *                            at the given hex radius.
 * @return {Object}           The cover updated egde center datum.
 */
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
  // hexDraw(contextImage, hexCorners, 'red', 'stroke')

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

  // Clear the canvas and reset the composite type in preperation 
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