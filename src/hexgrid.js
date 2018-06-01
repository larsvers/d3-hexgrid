import { clampLayoutPrecision, clampEdgeBand } from './utils';

import setHexGenerator from './setHexGenerator';
import getImageData from './getImageData';
import getImageCenters from './getImageCenters';

import getEdgeCenters from './getEdgeCenters';
import drawEdgeOverlap from './drawEdgeOverlap';
import overlapRatio from './overlapRatio';
import addCoverToCenters from './addCoverToCenters';

import processUserData from './processUserData';
import rollupPoints from './rollupPoints';
import rollupDensity from './rollupDensity';


export default function() {

	// Init exposed.
	let extent,
    geography,
		projection,
		pathGenerator,
		hexRadius = 4,
		layoutPrecision = 1,
    edgePrecision = 1,
    edgeBand = 0;

	// Main.
	const hexgrid = function(userData, userVariables) {


    // Identify hexagons to draw.

    const hexbin = setHexGenerator(extent, hexRadius);

    const size = hexbin.size();

    const centers = hexbin.centers();

    const imageDataCenter = getImageData(
      size,
      layoutPrecision,
      pathGenerator,
      geography,
      hexRadius,
      'fill',
      edgeBand
    );

    let imageCenters = getImageCenters(centers, imageDataCenter, size, layoutPrecision);


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

    const edgeTools = drawEdgeOverlap(
      edgePrecision,
      size,
      pathGenerator,
      geography,
      hexRadius
    );

    const imageEdgesCover = imageEdges.map(d => overlapRatio(d, edgeTools, edgePrecision));

    // Update imageCenters with cover.
    imageCenters = addCoverToCenters(imageCenters, imageEdgesCover);


    // Prepare user data to augment layout.

		const userDataPoints = processUserData(userData, projection, userVariables);

		const mergedData = imageCenters.concat(userDataPoints);

		const hexPoints = hexbin(mergedData);

		let points = rollupPoints(hexPoints);

    points = rollupDensity(points);

    // Augment hexbin generator.

		hexbin.layout       = points.layout;
    hexbin.maximum      = points.maximumPoints;
		hexbin.maximumWt    = points.maximumPointsWt;
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
    return arguments.length ? ((edgePrecision = _), hexgrid) : edgePrecision;
  };

	hexgrid.edgeBand = function(_) {
		return arguments.length ? ((edgeBand = clampEdgeBand(_)), hexgrid) : edgeBand;
	};

	return hexgrid;
}
