/**
 * Checks for each center if it covers a pixel in the image.
 * Checks only for centers that are within the bounds of width and height.
 * Note, this can be optimised (for loop instead of filter all).
 * @param  {Array}              centers     Hexagon centers covering the
 *                                          extent of the drawing canvas.
 * @param  {Uint8ClampedArray}  image       Pixel alpha values indicating fill.
 * @param  {Array}              size        Width and height of drawing canvas.
 * @param  {number}             precision   Hidden canvas ratio of the
 *                                          drawing canvas.
 * @return {Array}                          Hexagon centers covering 
 *                                          the displayed object.
 */
export default function(centers, image, size, precision) {
  const [w, h] = size;

  return centers
    .filter(center => {
      return (
        // Vouch for centers to be within bounds.
        center[0] >= 0 && center[0] <= w &&
        center[1] >= 0 && center[1] <= h &&
        image[Math.floor(precision * center[0]) + w * 
              Math.floor(precision * center[1])]
      );
    })
    .map((center,i) => { 
      return { id: i, x: center[0], y: center[1], gridpoint: 1, cover: 1 }
    });
}
