import { range } from 'd3-array';

/**
 * Produces a point grid layout.
 * @param  {number} w 	Point grid area width.
 * @param  {number} h 	Point grid area height.
 * @param  {number} r 	Approximate hex radius.
 * @return {Object[]}		All points in the point grid.   		
 */
export default function(w, h, r) {

  const hexDistance = r * 1.5;
  const cols = Math.ceil(w / hexDistance);
  const rows = Math.ceil(h / hexDistance);
  
  return range(rows * cols).map((el, i) =>
  
    ({
  		x: Math.floor(i % cols * hexDistance),
  		y: Math.floor(i / cols) * hexDistance,
  		datapoint: 0
  	})

  );

};
