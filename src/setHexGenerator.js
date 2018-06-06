import { hexbin } from 'd3-hexbin';

/**
 * Configure the hexbin generator.
 * @param  {Array}    userExtent    Set as either an extent or a size.
 * @param  {number}   radius        The desired hex radius.  
 * @return {function}               Hexbin generator function.
 */
export default function(userExtent, radius) {

  // Set the hexbin's extent.
  const nestedArrayLength = Array.from(new Set(userExtent.map(e => e.length)))[0];
  let extent = Array(2);

  if (nestedArrayLength === 2) {
    extent = userExtent;
  } else if (nestedArrayLength === undefined) {
    extent = [[0, 0], userExtent];
  } else {
    throw new Error(
      'Check \'extent\' is in the anticipated form [[x0,y0],[x1,y1]] or [x1,y1]'
    )
  }

  // Set the hexbin generator. Note, x and y will 
  // be set later when prepping the user data.
  return hexbin()
    .extent(extent)
    .radius(radius)
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

}

