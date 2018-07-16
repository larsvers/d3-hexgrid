/**
 * Checks for each center if it covers a pixel in the image.
 * @param  {Array}              centers     Hexagon centers covering the
 *                                          breadth of the drawing canvas.
 * @param  {Uint8ClampedArray}  image       Pixels indicating fill.
 * @param  {Array}              size        Width and height of drawing canvas.
 * @param  {number}             precision   Hidden canvas ratio of the
 *                                          drawing canvas.
 * @return {Array}                          Hexagon centers covering the
 *                                          displayed object only.
 */
// export default function(centers, image, size, precision) {
export default function(centers, image, size) {
  const w = size[0];

  return centers.filter(el => image[Math.floor(el.x) + w * Math.floor(el.y)]);
}
