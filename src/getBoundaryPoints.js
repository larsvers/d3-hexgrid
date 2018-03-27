export default function(geo, projection) {

	const featureCollection = geo.features[0].geometry.coordinates;

	return featureCollection.map(el => el[0].map(elt => projection(elt)));

}
