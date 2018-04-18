import { range } from 'd3-array';

/**
 * Produce a point grid layout spanning the path's bounding box.
 * @param  {Object}   geoObject     The geography GeoJSON.
 * @param  {function} projection 	  Projection function.
 * @param  {function} geoPath       Path generator.
 * @param  {number}   r             Hex radius.
 * @return {Array}		              Points in the point grid.
 */
export default function(geoObject, projection, geoPath, r) {

  // Get path dimensions.
  const b = geoPath.bounds(geoObject),
        w = b[1][0] - b[0][0],
        h = b[1][1] - b[0][1],
        xOff = b[0][0],
        yOff = b[0][1];

  // Set up the grid.
  const hexDistance = r * 1.5,
        cols = Math.ceil(w*1.01 / hexDistance),
        rows = Math.ceil(h*1.01 / hexDistance);
  
  // Produce the grid.
  return range(rows * cols).map((el, i) => 
  
    ({  
      x: xOff + (i % cols * hexDistance),
      y: yOff + Math.floor(i / cols) * hexDistance,
      gridpoint: 1
    })

  );

}
