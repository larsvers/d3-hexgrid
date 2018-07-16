import { quantile } from 'd3-array';

/**
 * Calculates the cover weighted measures. Also assigns a
 * minimum cover proxy to each layout point without a cover.
 * Requried as some user data points can lie just outside the image.
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
  const hexArea = (3 / 2) * Math.sqrt(3) * (r ** 2);

  // Initialise extents.
  let maxPoints = 0;
  let maxPointsWt = 0;
  let maxDensity = 0;

  // Initialise the min values with the largest possible min value.
  let minPoints = points.length;
  let minPointsWt = points.length;
  let minDensity = points.length / hexArea;

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
    maxPoints   = Math.max(maxPoints, point.datapoints);
    maxPointsWt = maxPoints;
    maxDensity  = Math.max(maxDensity, point.pointDensity);

    if (point.datapoints > 0)
      minPoints   = Math.min(minPoints, point.datapoints);
      minPointsWt = minPoints;
    if (point.pointDensity > 0)
      minDensity  = Math.min(minDensity, point.pointDensity);
  }

  const extentPoints = [minPoints, maxPoints];
  const extentPointsWeighted = [minPointsWt, maxPointsWt];
  const extentPointDensity = [minDensity, maxDensity];

  return {
    layout: points,
    extentPoints,
    extentPointsWeighted,
    extentPointDensity
  };
}
