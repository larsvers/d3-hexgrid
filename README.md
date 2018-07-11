# d3-hexgrid

A wrapper of _d3-hexbin_, _**d3-hexgrid**_ does three things:

1. It allows you to [regularly tesselate](https://www.mathsisfun.com/geometry/tessellation.html) polygons with hexagons. _**d3-hexbin**_ produces hexagons where there is data. _**d3-hexgrid**_ produces hexagons where there is a base geography you define.

2. Hexagons at the edge of your geography are often truncated by the geography's border. _d3.hexgrid_ calculates the inside-area of these edge hexagons allowing you to encode edge data based on the correct point density. See below for more LINK or read this discussion LINK.

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

<sub>data source: [dracos.co.uk](http://dracos.co.uk/) from [here](http://dracos.co.uk/made/locating-postboxes) via [Free GIS Data](https://freegisdata.rtwilson.com/)</sub>

TODO: link to blocks

It might be obvious that _d3-hexgrid_ is build with geographic map tesselation in mind. However, nothing should stop you to tesselate non-geographic polygons as long as you represent the data in GeoJSON or TopoJSON (see more [below](TODO link)).


## Install

```
npm install d3-hexgrid
```

You can also download the build files [from here](TODO link).

Or you can use [unpkg](https://unpkg.com/) to script-link to _d3-hexgrid_:

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
const hex = hexMaker(myPointLocationData);

// Create a colour scale.
const colourScale = d3.scaleSequential(d3.interpolateViridis)
	.domain([hex.grid.maximum, 1]); 

// Draw the hexes.
svg.append('g')
	.selectAll('.hex')
	.data(hex.grid.layout)
	.enter()
	.append('path')
	.attr('class', 'hex')
	.attr('transform', d => `translate(${d.x} ${d.y})`)
	.attr('d', hex.hexagon())
	.style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));


```

### Breaking this down:

First, we create an `SVG` element. Let's assume our data represents mainland US and comes in as a TopoJSON. We first convert it to GeoJSON, use an Albers projection to fit our SVG and finally get the appropriate path generator.

```
const svg = d3.select('#container')
	.append('svg')
	.attr(width, 'width')
	.attr('height, 'height');

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
Now we can call our _hexgrid_ instance passing in our data. 

```
const hex = hexMaker(myPointLocationData);
```

This will return a hexbin generator as [`d3.hexbin()`](https://github.com/d3/d3-hexbin) does, augmented with an additional object called `grid`, which exposes the following properties:

![grid object](img/grid-object.jpg)

* `imageCenters` is an array of all [x, y] hexagon centers of the hexgrid.

* `layout` is an array of objects, each representing a hexagon in the grid. Every object will hold all point locations per hexagon in pixel coordinates as well as aggregate values for this hexagon. Here's an example hexagon layout object with three locations or _**datapoints**_:

	![layout object](img/layout-object.jpg)
	
	Each point location is stored as an array item as well as the following aggregate values:

	- `cover` is the percentage of the hexagon area within the geography.
	- `datapoints` is the number of points binned in the hexagon.
	- `datapointsWt` is the number of points weighted by the inverse cover.
	- `pointDensity` is this hexagon's point density.
	- `gridpoint` marks this hexagon as part of the initial hexgrid. This allows you to distinguish hexagons added by the data. Imprecise latitude and longitude data values can lead to the production of hexagons just outside the hexgrid. _d3.hexgrid_ will still capture and produce them. But you can spot and treat them by filtering for `gridpoint === 0`.
	- `x` and `y`are the hexagon center positions in pixel coordinates.

* `maxPoints` is the maximum number of location points binned.
* `maxPointsWeighted` is the maximum number of location points binned and weighted by partial geography cover for edge hexagons (hexagons that cross the boundaries of the defined geography).
* `maxPointDensity` is the maximum point density, accounting for smaller edge hexagon cover. 
* `minPointDensity` is the minimum point density, accounting for smaller edge hexagon cover. 

	These maximums and the minimum can be used to set the extents of a colour scale when encoding number of points or point density. The minimum number of points will always be 1 (or 0 which you, however, might encode suitably different, e.g. white or black) and is therefore not exposed. In contrast, when working with point density you will need the lowest non-zero point density as it will change with different data. 
	
Working with points, for example, we might want to create the following colour scale:


```
const colourScale = d3.scaleSequential(d3.interpolateViridis)
	.domain([hex.maxPoints, 1]); 
```
Here, we decide to encode the number of points per hexagon as colours along the spectrum of the [viridis colour map](https://github.com/d3/d3-scale-chromatic#interpolateViridis) and create an appropriate colour scale. 

Finally, we build the visual:

```
svg.append('g')
	.selectAll('.hex')
	.data(hex.grid.layout)
	.enter()
	.append('path')
	.attr('class', 'hex')
	.attr('transform', d => `translate(${d.x} ${d.y})`)
	.attr('d', hexgrid.hexagon())
	.style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));

```
We use the `hex.grid.layout` to produce as many path's as there are hexagons - as we would with `d3.hexbin()` - now, however, making sure we have as many hexagons to cover our entire GeoJSON polygon. We `translate` them into place and draw them with `hexgrid.hexagon()`. Lastly, we give our empty hexagons (`!d.datapoints`) a white fill and colour encode all other hexagons depending on their number of `datapoints`.



## API Reference


<a href="#hexgrid" name="hexgrid">#</a> d3.<b>hexgrid</b>()

Constructs a hexgrid generator called _hexgrid_ in the following. To be configured in the next step, before calling it with the data you would like to visualise. 


<a href="#hex" name="hex">#</a> _hexgrid(⟨ data ⟩ [, ⟨ names ⟩])_

Generates a hexbin generator augmented with a `grid` property, exposing the hexagon layout data as well as maximas for point and point density measures. See [Example usage](#example-usage) for details. Optionally _⟨ names ⟩_ can be an array of strings, listing properties you would like to carry through to the grid layout from the original data.

Assuming you want to visualise restaurants on a map and have a dataset containing the variables `website` and `opening_times` you can say:

```
hexgrid(restaurantData, ['website', 'opening_times'])
```

As a result, objects in the <code>_hexgrid_.grid.layout</code> array will contain the two variables in addition to thhe default _x_ and _y_ coordinates:

![layout-object-vars](img/layout-object-vars.jpg)

<a href="#hex-extent" name="hex-extent">#</a> _hexgrid._<b>extent</b>(⟨ _Array_ ⟩)

_Required_. Sets the extent of the hexbin generator produced internally. ⟨ _Array_ ⟩ can come as either a 2D array specifying start and end point [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box, y₀ is the top, x₁ is the right and y₁ is the bottom. Alternatively ⟨ _Array_ ⟩ can be specified as an array of just width and height [x₁, y₁] with the top-left corner assumed to be [0, 0]. The following two statements are equivalent:

```
hexgrid.extent([[0, 0], [width, height]]);
hexgrid.extent([width, height]);
```


<a href="#hex-geography" name="hex-geography">#</a> _hexgrid._<b>geography</b>(⟨ _object_ ⟩)

_Required_. ⟨ _object_ ⟩ reprsents the base polygon for the hexgrid in GeoJSON format. If you for example were to project a hexgrid onto Bhutan, ⟨ _object_ ⟩ would be a GeoJSON object of Bhutan. 


<a href="#hex-projection" name="hex-projection">#</a> _hexgrid._<b>projection</b>(⟨ _function_ ⟩)

_Required_. ⟨ _function_ ⟩ is the projection function for the previously defined _geography_ commonly specified within the bounds of _extent_. See [here](https://github.com/d3/d3-geo) or [here](https://github.com/d3/d3-geo-projection) for a large pond of projection functions.


<a href="#hex-pathGenerator" name="hex-pathGenerator">#</a> _hexgrid._<b>pathGenerator</b>(⟨ _function_ ⟩)

_Required_. ⟨ _function_ ⟩ is the path generator to produce the drawing instructions of the previously defined _geography_ based on the also previously defined _projection_.


<a href="#hex-hexRadius" name="hex-hexRadius">#</a> _hexgrid._<b>hexRadius</b>(⟨ _number_ ⟩)

_Optional_. The desired hexagon radius in pixel. Defaults to 4.



<a href="#hex-edgePrecision" name="hex-edgePrecision">#</a> _hexgrid._<b>edgePrecision</b>(⟨ _number_ ⟩)

_Optional_. The edge precision sets the size of the internally produced canvas to identify which area of the edge hexagon is covered by the geography. The higher the precision, the better the pixel detection at the hexagon edges. Values can be larger than 1 for small visuals. Values smaller than 0.3 will be coerced to 0.3. The default value of 1 will be fine for most purposes.


<a href="#hex-gridExtend" name="hex-gridExtend">#</a> _hexgrid._<b>gridExtend</b>(⟨ _number_ ⟩)

_Optional_. _gridExtend_ controls the size of the base geography. _gridExtend_ allows you to "inflate" your geography and can be used to draw more hexagons around the edges that otherwise would not be drawn.

![gridExtend](img/gridExtend.jpg)

_gridExtend_ is measured in units of _hexRadius_. For example, a _gridExtend_ value of 2 would extend the grid by _2 &times; hexRadius_ pixel.


<a href="#hex-geoKeys" name="hex-geoKeys">#</a> _hexgrid._<b>geoKeys</b>(⟨ _Array_ ⟩)

_Optional_. _d3.hexgrid_ will try to guess the key names for longitude and latitude variables in your data. The following case-insensitive key names will be sniffed out: 

* _longitude_, _long_, _lon_, _lng_, _lambda_ as well as 
* _latitude_, _lat_ and _phi_.

If you choose other names for them like for example _upDown_ and _leftRight_, you 
have to specify them as `.geokeys(['upDown', 'leftRight'])` with the first element representing longitude and the second latitude. 

Please don't call your geo keys `x` or `y` or otherwise include `x` or `y` keys in your passed in user variables as they are reserved keys for the pixel coordinates of the layout.
