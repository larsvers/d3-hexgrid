/**
 * Checks for each center if it covers a pixel in the image.
 * Checks only for centers that are within the bounds of width and height.
 * Note, this can be optimised (for loop instead of filter all).
 * @param  {Array}              centers     Hexagon centers covering the
 *                                          breadth of the drawing canvas.
 * @param  {Uint8ClampedArray}  image       Pixels indicating fill.
 * @param  {Array}              size        Width and height of drawing canvas.
 * @param  {number}             precision   Hidden canvas ratio of the
 *                                          drawing canvas.
 * @return {Array}                          Hexagon centers covering the
 *                                          displayed object only.
 */
export default function(centers, image, size, precision) {
  const [w, h] = size;

  return centers
    .filter(el => {
      return (
        image[Math.floor(precision * el.x) + w * Math.floor(precision * el.y)]
      );
    });
}
