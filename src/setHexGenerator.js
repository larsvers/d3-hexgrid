import { hexbin } from 'd3-hexbin';

/**
 * Configure the hexbin generator.
 * @param  {Array}    extent   Drawing area extent.
 * @param  {number}   radius   The desired hex radius.
 * @return {function}          Hexbin generator function.
 */
export default function(extent, radius) {
  // Set the hexbin generator. Note, x and y will
  // be set later when prepping the user data.
  // Also round radius to the nearest 0.5 step.
  return hexbin()
    .extent(extent)
    .radius(radius)
    .x(d => d.x)
    .y(d => d.y);
}
