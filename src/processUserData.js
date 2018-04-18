/**
 * Process the user data to be structured for further use.
 * @param  {Array} 		data     			Array of user data objects.
 * @param  {function} projection    Geo projection.
 * @param  {Array} 		variables			Optional. Array of variables the user 
 *                               		would like to add to the layout.
 * @return {Array}            			Array of user's data points.
 */
export default function(data, projection, variables) {

	return data.map(el => {

		const coords = projection([+el.lng, +el.lat]);

		const obj = {};
		obj.x = coords[0];
		obj.y = coords[1];
		
		if(variables && variables.length) {

			variables.forEach(varName => {
				obj[varName] = el[varName];
			});

		}

		return obj;

	});

}
