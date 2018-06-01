import { min } from 'd3-array';

/**
 * Assigns a minimum cover proxy to each layout point
 * without a cover. Requried as some user data points 
 * can lie just outside the image.
 * Next, calculate the point density per hexagon.
 * @param  {Array}  points  Layout objects.
 * @return {Array}          Cover augmented layout objects.
 */
export default function(points) {

  // Establish a minimum cover proxy.
  const minCover = min(points, d => d.cover) * 0.9;

  // Initialise maxima.
  let maximumPoints = 0;
  let maximumPointsWt = 0;

  // All layout points w/o cover will 
  // get assigned the minimum cover proxy. 
  // All datapoints will be weighted by 
  // the inverse cover - the weight to 
  // calculate the point density.
  for (var i = 0; i < points.length; i++) {
    const point = points[i];
    if (point.cover) {
      point.datapointsWt = point.datapoints * (1/point.cover)
    } else {
      point.cover = minCover;
      point.datapointsWt = point.datapoints * (1/point.cover);
    }

    // Update maxima.
    maximumPoints   = Math.max(maximumPoints,   point.datapoints);
    maximumPointsWt = Math.max(maximumPointsWt, point.datapointsWt);

  }

  return { layout: points, maximumPoints, maximumPointsWt };

}