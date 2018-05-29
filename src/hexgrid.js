import { clampLayoutPrecision } from './utils'

import setHexGenerator from './setHexGenerator';
import getImageData from './getImageData';
import getImageCenters from './getImageCenters';

import getEdgeCenters from './getEdgeCenters';
import drawEdgeOverlap from './drawEdgeOverlap';
import overlapRatio from './overlapRatio';
import addCoverToCenters from './addCoverToCenters';

import processUserData from './processUserData';
import rollupHexPoints from './rollupHexPoints';




/**
 * Produce corner points for a pointy hexagon.
 * @param  {Object} center Hexagon center position.
 * @param  {number} r      Radius of hexagon.
 * @param  {number} i      Index of point to calculate.
 * @return {Object}        Hexagon corner position.
 */
function pointyHexCorner(center, r, i) {
  const point = {};
  const angleDegree = 60 * i - 30;
  const angleRadian = Math.PI / 180 * angleDegree;
  point.x = center.x + r * Math.cos(angleRadian);
  point.y = center.y + r * Math.sin(angleRadian);
  return point;
}

/**
 * Draw a hexagon.
 * @param  {Object} context The canvas context.
 * @param  {Object} corners Hexagon corner positions.
 * @param  {String} colour  Fill colour.
 * @return {[type]}         undefined
 */
function hexDraw(context, corners, colour) {
  context.beginPath();
  corners.forEach(d => {
    d === 0 
      ? context.moveTo(d.x, d.y)
      : context.lineTo(d.x, d.y);
  });
  context.closePath();
  context.fillStyle = colour;
  context.fill();
}




export default function() {

	// Init exposed.
	let extent,
    geography,
		projection,
		pathGenerator,
		hexRadius = 4,
		layoutPrecision = 1,
    edgePrecision = 1;

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
      'fill'
    );

    let imageCenters = getImageCenters(centers, imageDataCenter, size, layoutPrecision);


    // Identify edge hexagons and calculate image overlap ratio.

    const imageDataEdges = getImageData(
      size, 
      layoutPrecision, 
      pathGenerator, 
      geography, 
      hexRadius,
      'stroke'
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

		const rolledUpHexPoints = rollupHexPoints(hexPoints);


    // Augment hexbin generator.

		hexbin.layout = rolledUpHexPoints.layout;
		hexbin.maximum = rolledUpHexPoints.maxHexPoints;
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

	return hexgrid;
}
