/**
 * Adds the updated cover value to each center datum.
 * @param  {Array}  centers   All center objects including the edge centers.
 * @param  {Array}  edges     Only the edge center objects.
 * @return {Array}            The updated center objects.
 */
export default function(centers, edges) {
  const centersUpdated = centers.slice(0);

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    // Assuming the centers array id's are
    // consistent with the edge id's.
    centersUpdated[edge.id].cover = edge.cover;
  }

  return centersUpdated;
}
