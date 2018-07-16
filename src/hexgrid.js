import { convertToMin } from './utils';

import setHexGenerator from './setHexGenerator';
import getImageData from './getImageData';
import getImageCenters from './getImageCenters';

import getEdgeCenters from './getEdgeCenters';
import getEdgeTools from './getEdgeTools';
import getCover from './getCover';
import addCover from './addCover';

import prepUserData from './prepUserData';
import rollupPoints from './rollupPoints';
import rollupDensity from './rollupDensity';

/**
 * Main hexgrid component.
 */
export default function() {
  // Init exposed.
  let extent;
  let geography;
  let projection;
  let pathGenerator;
  let hexRadius = 4;
  let edgePrecision = 1;
  let gridExtend = 0;
  let geoKeys;

  /**
   * hexgrid function producing the layout.
   * @param  {Array} userData       Datapoints to visualise.
   *                                One datum represents one location.
   * @param  {Array} userVariables  Optional array of object keys to be
   *                                included in the final layout hex data.
   * @return {function/Object}      Augmented hexbin generator.
   */
  const hexgrid = function(userData, userVariables) {
    // Identify hexagons to draw.

    const hexbin = setHexGenerator(extent, hexRadius);

    const size = hexbin.size();

    const centers = hexbin.centers();

    const imageData = getImageData(
      size,
      pathGenerator,
      geography,
      hexRadius,
      'fill',
      gridExtend
    );

    let imageCenters = getImageCenters(centers, imageData, size);

    // Identify edge hexagons and calculate image overlap ratio.

    const imageDataEdges = getImageData(
      size,
      pathGenerator,
      geography,
      hexRadius,
      'stroke',
      gridExtend
    );

    const imageEdges = getEdgeCenters(imageCenters, imageDataEdges, size);

    const edgeTools = getEdgeTools(
      edgePrecision,
      size,
      pathGenerator,
      geography,
      hexRadius,
      gridExtend
    );

    const imageEdgesCover = imageEdges.map(d =>
      getCover(d, edgeTools, edgePrecision, hexRadius)
    );

    imageCenters = addCover(imageCenters, imageEdgesCover);

    // Prepare user data to augment layout.

    const userDataPrepped = prepUserData(
      userData,
      projection,
      geoKeys,
      userVariables
    );

    const mergedData = imageCenters.concat(userDataPrepped);

    const hexPoints = hexbin(mergedData);

    let hexData = rollupPoints(hexPoints);

    hexData = rollupDensity(hexData, hexRadius);

    // Augment hexbin generator.

    hexbin.grid = {};
    hexbin.grid.layout = hexData.layout;
    hexbin.grid.imageCenters = imageCenters;
    hexbin.grid.extentPoints = hexData.extentPoints;
    hexbin.grid.extentPointsWeighted = hexData.extentPointsWeighted;
    hexbin.grid.extentPointDensity = hexData.extentPointDensity;

    return hexbin;
  };

  // Exposed.
  hexgrid.extent = function(_) {
    return arguments.length ? ((extent = _), hexgrid) : extent;
  };

  hexgrid.geography = function(_) {
    return arguments.length ? ((geography = _), hexgrid) : geography;
  };

  hexgrid.projection = function(_) {
    return arguments.length ? ((projection = _), hexgrid) : projection;
  };

  hexgrid.pathGenerator = function(_) {
    return arguments.length ? ((pathGenerator = _), hexgrid) : pathGenerator;
  };

  hexgrid.hexRadius = function(_) {
    return arguments.length ? ((hexRadius = _), hexgrid) : hexRadius;
  };

  hexgrid.edgePrecision = function(_) {
    return arguments.length
      ? ((edgePrecision = convertToMin(_, 'Edge precision', 0.3)), hexgrid)
      : edgePrecision;
  };

  hexgrid.gridExtend = function(_) {
    return arguments.length
      ? ((gridExtend = convertToMin(_, 'Edge band', 0)), hexgrid)
      : gridExtend;
  };

  hexgrid.geoKeys = function(_) {
    return arguments.length ? ((geoKeys = _), hexgrid) : geoKeys;
  };

  return hexgrid;
}
