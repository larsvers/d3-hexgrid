# d3-hexgrid

A wrapper of _d3-hexbin_, _d3-hexgrid_ does three things:

1. It allows you to [regularly tesselate](https://www.mathsisfun.com/geometry/tessellation.html) polygons with hexagons. _**d3-hexbin**_ produces hexagons where there is data. _**d3-hexgrid**_ produces hexagons where there is an area you define.

2. It calculates the real area of edge hexagons covered by your base geography. This allows you to encode edge hexagons based on the real point-to-area ratio (point density). See below for more LINK or read this discussion LINK.

2. It provides a layout generator for your point location data to simplify the visual encoding of your data. The layout rolls up the number of your point counts, adds cover per hexagon and provides a maximum of point counts for a colour scale you might want to build.

## Examples

Militarised interstate disputes in Europe 1816-2001

![disputes](img/disputes.jpg)

<sub>data source: [Midloc via data.world](https://data.world/cow/militarized-dispute-locations/workspace/file?filename=midloc-v1-1%2FMIDLOC_1.1.csv)</sub>

Cities across the world

![cities](img/cities.jpg)

<sub>data source: [maxmind](http://www.maxmind.com/)</sub>

Farmers Markets in the US

![farmer markets](img/markets.jpg)

<sub>data source: [USDA](https://www.ams.usda.gov/local-food-directories/farmersmarkets)</sub>

Postboxes in the UK 

![postboxes](img/postboxes.jpg)

<sub><i>NI data seemingly incomplete</i>. Anyway.. data source: [dracos.co.uk](http://dracos.co.uk/made/locating-postboxes/export.php) via [Free GIS Data](https://freegisdata.rtwilson.com/)</sub>

TODO: link to blocks

It might be obvious that _d3-hexgrid_ is build with geographic map tesselation in mind. However, nothing should stop you to tesselate non-geographic polygons as long as you represent the data in GeoJSON or TopoJSON (see more [below](TODO link)).

## Install

```
npm install d3-hexgrid
```

Alternatively, you can download the build files [from here](TODO link).

Lastly, you can use [unpkg](https://unpkg.com/) to script-link to _d3-hexgrid_:

```
<script src="https://unpkg.com/d3-hexgrid.js"></script>
```
TODO check if this works


## Example usage
Here's a bare bone example usage of _d3-hexgrid_.

```

// Container.
const svg = d3.select('#container').append('svg')

// Geo data, projection and path.
const geo = topojson.feature(topo, topo.objects.us_mainland);
const projection = d3.geoAlbers().fitSize([width, height], geo);
const geoPath = d3.geoPath().projection(projection);

// Produce and configure the hexgrid instance.
const hexMaker = d3.hexgrid()
	.geography(geo)
    .projection(projection)
	.pathGenerator(geoPath);

// Get the hexbin generator and the layout. 
const hexgrid = hexMaker(myPointLocationData);

// Create a colour scale.
const colourScale = d3.scaleSequential(d3.interpolateViridis)
	.domain([hexgrid.maximum, 1]); 

// Draw the hexes.
svg.append('g')
	.selectAll('.hex').data(hexgrid.layout)
	.enter().append('path')
	.attr('class', 'hex')
	.attr('transform', d => `translate(${d.x} ${d.y})`)
	.attr('d', hexgrid.hexagon())
	.style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));


```

Breaking this down:

First, we create an `SVG` element. Let's assume our data represents mainland US and comes in as a TopoJSON. We first convert it to GeoJSON, use an Albers projection to fit our SVG and finally get the appropriate path generator.

```
const svg = d3.select('#container').append('svg')
	.attr(width, 'width').attr('height, 'height')

const geo = topojson.feature(topo, topo.objects.us_mainland);
const projection = d3.geoAlbers().fitSize([width, height], geo);
const geoPath = d3.geoPath().projection(projection);

```
Next, we use `d3.hexgrid()` to produce a _hexgrid_ instance we call `hexMaker`. We immediately configure it by passing in the GeoJOSN, the projection and the path-generator.

```
const hexMaker = d3.hexgrid()
	.geography(geo)
    .projection(projection)
	.pathGenerator(geoPath);
```
Now we can call our _hexgrid_ instance passing in our data. This will return a hexbin generator as [`d3.hexbin()`](https://github.com/d3/d3-hexbin) does, augmented with two additional properties `layout` and `maximum`.  

```
const hexgrid = hexMaker(myPointLocationData);
```

`layout` is an array of objects, each representing one hexagon. Each object will hold all data items per hexagon as well as a property called `datapoints` exposing the number of datapoints for this hexagon. 


```
const colourScale = d3.scaleSequential(d3.interpolateViridis)
	.domain([hexgrid.maximum, 1]); 
```
We decide to encode the number of points per hexagon as colours along the spectrum of the [viridis colour  map](https://github.com/d3/d3-scale-chromatic#interpolateViridis) and create an appropriate colour scale. Here, we use the second property exposed by our hex generator, `hexgrid.maximum`, holding the maximum number of points for all hexagons. 

Finally, we build the visual:

```
svg.append('g')
	.selectAll('.hex')
	.data(hexgrid.layout)
	.enter()
	.append('path')
	.attr('class', 'hex')
	.attr('transform', d => `translate(${d.x} ${d.y})`)
	.attr('d', hexgrid.hexagon())
	.style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));

```
We use the `hexgrid.layout` to produce as many path's as there are hexagons - as we would with `d3.hexbin()`, now, however, making sure we have as many hexagons to cover our entire GeoJSON polygon. We `translate` them into place and draw them with `hexgrid.hexagon()`. Lastly, we give our empty hexagons (`!d.datapoints`) a white fill and colour encode all other hexagons depending on their number of `datapoints`.



## API Reference

API documentation. Use bold for symbols (such as constructor and method names) and italics for instances. See the other D3 modules for examples.

<a href="#hexgrid" name="hexgrid">#</a> d3.<b>hexgrid</b>()

Constructs a hexgrid generator called _hexgrid_ in the following. To be configured in the next step, before calling it with the data you would like to visualise. 


<a href="#hex-extent" name="hex-extent">#</a> _hexgrid._<b>extent</b>(⟨ _Array_ ⟩])

_Required_. Sets the extent of the hexbin generator produced internally. ⟨ _Array_ ⟩ can come as either a 2D array specifying start and end point [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box, y₀ is the top, x₁ is the right and y₁ is the bottom. Alternatively ⟨ _Array_ ⟩ can be specified as an array of just width and height [x₁, y₁] with the top-left corner assumed to be [0, 0]. The following two statements are equivalent:

```
hexgrid.extent([[0, 0], [width, height]]);
hexgrid.extent([width, height]);
```


<a href="#hex-geography" name="hex-geography">#</a> _hexgrid._<b>geography</b>(⟨ _object_ ⟩)

_Required_. ⟨ _object_ ⟩ reprsents the base polygon for the hexgrid in GeoJSON format. If you were to project a hexgrid onto Bhutan, ⟨ _object_ ⟩ would be a GeoJSON object of Bhutan. 


<a href="#hex-projection" name="hex-projection">#</a> _hexgrid._<b>projection</b>(⟨ _function_ ⟩)

_Required_. ⟨ _function_ ⟩ is the projection function for the previously defined _geography_ commonly specified within the bounds of _extent_. See [here](https://github.com/d3/d3-geo) or [here](https://github.com/d3/d3-geo-projection) for a large pond of options.


<a href="#hex-pathGenerator" name="hex-pathGenerator">#</a> _hexgrid._<b>pathGenerator</b>(⟨ _function_ ⟩)

_Required_. ⟨ _function_ ⟩ is the path generator to produce the drawing instructions of the previously defined _geography_.


<a href="#hex-hexRadius" name="hex-hexRadius">#</a> _hexgrid._<b>hexRadius</b>(⟨ _number_ ⟩)

_Optional_. The desired hexagon radius. Defaults to 4.


<a href="#hex-layoutPrecision" name="hex-layoutPrecision">#</a> _hexgrid._<b>layoutPrecision</b>(⟨ _number_ ⟩)

_Optional_. The layout precision sets the scale of the internally produced canvas to identify which area of the canvas is covered by the geography. The higher the precision, the better the tesselation at the objects edges. Values can be in a range from 0.1 and 1 and will get coerced to 0.1 if lower and 1 if higher. Useful only for very large visuals, leave untouched otherwise. Default value 1.


<a href="#hex-edgePrecision" name="hex-edgePrecision">#</a> _hexgrid._<b>edgePrecision</b>(⟨ _number_ ⟩)

_Optional_. The edge precision sets the size of the internally produced canvas to identify which area of the edge hexagon are covered by the geography. The higher the precision, the better the pixel detection at the hexagon edges. Values can be larger than 1 for small visuals. Values smaller than 0.3 will be coerced to 0.3. Default value 1.


<a href="#hex-edgeBand" name="hex-edgeBand">#</a> _hexgrid._<b>edgeBand</b>(⟨ _number_ ⟩)

_Optional_. _edgeBand_ controls the width of the geography before identifying the hexagon centers within the geography. The broader the border, the wider the hexgrid. _edgeBand_ is used as multiplier to _hexRadius_, so an _edgeBand_ of 2 will produce a border of 2 &times; _hexRadius_.








