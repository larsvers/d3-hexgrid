/**
 * Processes the user data to an array of objects, structured for further use.
 * @param  {Array} data     				Array of user data objects.
 * @param  {Array} variables			 	Array of variables the user would like to add to the final layout.
 * @return {Array}            			Array of user's data points.
 */
export default function(projection, data, variables) {

	return data.map(function(el) {

		const coords = projection([+el.lng, +el.lat]);

		const obj = {};
		obj.x = coords[0];
		obj.y = coords[1];
		
		if(variables && variables.length) {
			variables.forEach(function(elt) {
				obj[elt] = el[elt];
			});
		}

		return obj;

	});

}