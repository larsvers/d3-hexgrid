import { range } from 'd3-array';

/**
 * Produces a point grid layout.
 * @param  {number} w 	Point grid area width.
 * @param  {number} h 	Point grid area height.
 * @param  {number} r 	Approximate hex radius.
 * @return {Object[]}		All points in the point grid.   		
 */
export default function(w, h, r) {

  var hexDistance = r * 1.5;
  var cols = w / hexDistance;
  var rows = Math.floor(h / hexDistance);
  
  return range(rows * cols).map(function(el, i) {

  	return {
  		x: i % cols * hexDistance,
  		y: Math.floor(i / cols) * hexDistance,
  		datapoint: 0
  	};

  });

};
