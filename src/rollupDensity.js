import { quantile } from 'd3-array';

/**
 * Assigns a minimum cover proxy to each layout point
 * without a cover. Requried as some user data points
 * can lie just outside the image.
 * @param  {Array}  points  Layout objects.
 * @param  {number} r       The hexagon's radius.
 * @return {Array}          Cover augmented layout objects.
 */
export default function(points, r) {
  // Establish a minimum cover proxy: get a sorted array of cover values 
  // for the quantile function. Only consider edges with cover < 1.
  const ascendingCover = points
    .filter(p => p.cover > 0 && p.cover < 1)
    .map(d => d.cover)
    .sort((a, b) => a - b);
  // Get the 10th percentile as the proxy.
  const quartileCover = quantile(ascendingCover, 0.1);

  // Get the hexagon's area in square pixel.
  const hexArea = (3 / 2) * Math.sqrt(3) * Math.pow(r, 2);

  // Initialise extents.
  let maxPoints = 0;
  let maxPointsWt = 0;
  let maxDensity = 0;
  // init the min value arbitrarily high.
  let minDensity = 100;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    // All layout points w/o cover will get assigned the cover proxy.
    // Note, only non-gridpoont datapoints will have no cover.
    if (!point.cover) {
      point.cover = quartileCover;
    }

    // Calculate the cover weighted measures.
    point.datapointsWt = point.datapoints * (1 / point.cover);
    point.pointDensity = point.datapoints / (hexArea * point.cover);

    // Update extents.
    maxPoints = Math.max(maxPoints, point.datapoints);
    maxPointsWt = Math.max(maxPointsWt, point.datapointsWt);
    maxDensity = Math.max(maxDensity, point.pointDensity);
    if (point.pointDensity > 0)
      minDensity = Math.min(minDensity, point.pointDensity);
  }

  return {
    layout: points,
    maxPoints,
    maxPointsWt,
    maxDensity,
    minDensity
  };
}
