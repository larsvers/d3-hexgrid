/**
 * Checks for each center if it covers a pixel in the displayed object.
 * Checks only for centers that are within the bounds of width and height.
 * Note, this can be optised (for loop instead of filter all)
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
        el[0] >= 0 && el[0] <= w &&
        el[1] >= 0 && el[1] <= h &&
        image[Math.floor(precision * el[0]) + w * Math.floor(precision * el[1])]
      );
    })
    .map(el => ({ x: el[0], y: el[1], gridpoint: 1 }));
}
