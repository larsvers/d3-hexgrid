import { clampLayoutPrecision, convertToMin } from './utils';

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
	let extent,
    geography,
		projection,
		pathGenerator,
		hexRadius = 4,
		layoutPrecision = 1,
    edgePrecision = 1,
    edgeBand = 0,
    geoKeys;

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
      layoutPrecision,
      pathGenerator,
      geography,
      hexRadius,
      'fill',
      edgeBand
    );

    let imageCenters = getImageCenters(
      centers,
      imageData,
      size,
      layoutPrecision
    );

    // Identify edge hexagons and calculate image overlap ratio.

    const imageDataEdges = getImageData(
      size,
      layoutPrecision,
      pathGenerator,
      geography,
      hexRadius,
      'stroke',
      edgeBand
    );

    const imageEdges = getEdgeCenters(
      imageCenters,
      imageDataEdges,
      size,
      layoutPrecision
    );

    const edgeTools = getEdgeTools(
      edgePrecision,
      size,
      pathGenerator,
      geography,
      hexRadius
    );

    const imageEdgesCover = imageEdges.map(d => {
      return getCover(d, edgeTools, edgePrecision)
    });

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

    hexData = rollupDensity(hexData);

    // Augment hexbin generator.

		hexbin.layout       = hexData.layout;
    hexbin.maximum      = hexData.maximumPoints;
		hexbin.maximumWt    = hexData.maximumPointsWt;
    hexbin.imageCenters = imageCenters;

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

  hexgrid.layoutPrecision = function(_) {
    return arguments.length ? ((layoutPrecision = clampLayoutPrecision(_)), hexgrid) : layoutPrecision;
  };

  hexgrid.edgePrecision = function(_) {
    return arguments.length ? ((edgePrecision = convertToMin(_, 'Edge precision', 0.3)), hexgrid) : edgePrecision;
  };

  hexgrid.edgeBand = function(_) {
    return arguments.length ? ((edgeBand = convertToMin(_, 'Edge band', 0)), hexgrid) : edgeBand;
  };

	hexgrid.geoKeys = function(_) {
		return arguments.length ? ((geoKeys = _), hexgrid) : geoKeys;
	};

	return hexgrid;
}
