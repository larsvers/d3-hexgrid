# d3-hexgrid

A wrapper of [_d3-hexbin_](https://github.com/d3/d3-hexbin), _**d3-hexgrid**_ does three things:

1. It allows you to [regularly tessellate](https://www.mathsisfun.com/geometry/tessellation.html) polygons with hexagons. _**d3-hexbin**_ produces hexagons where there is data. _**d3-hexgrid**_ produces hexagons where there is a base geography you define.

2. Hexagons at the edge of your geography are often truncated by the geography's border. _d3.hexgrid_ calculates the inside-area or _cover_ of these edge hexagons allowing you to encode edge data based on the correct point density. [See below for more](#cover-correction).

3. Lastly, _d3.hexgrid_ provides an extended layout generator for your point location data to simplify the visual encoding of your data. The layout rolls up the number of point locations per hexagon, adds cover and point density and provides point count and point density extents for colour scale domains. [See below for more](#breaking-the-example-down).

Please [see this notebook](https://beta.observablehq.com/@larsvers/hexgrid-maps-with-d3-hexgrid) for a description of the algorithm.

Go straight to the [API reference](#api-reference).

## Install

```
npm install d3-hexgrid
```

You can also download the build files [from here](https://github.com/larsvers/d3-hexgrid/releases).

Or you can use [unpkg](https://unpkg.com/) to script-link to _d3-hexgrid_:

```
<script src="https://unpkg.com/d3-hexgrid"></script>
```

## Examples

#### Militarised interstate disputes in Europe 1816-2001

![disputes](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/disputes.jpg)

<sub>Data source: [Midloc via data.world](https://data.world/cow/militarized-dispute-locations/). Additional clip-path applied. • [code](https://bl.ocks.org/larsvers/049c8f382ea07d48ca0a395e661d0fa4)</sub>

#### Cities across the world

![cities](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/cities.jpg)

<sub>Data source: [maxmind](https://www.maxmind.com/en/free-world-cities-database). Not equal area projected. • [code](https://bl.ocks.org/larsvers/da5b2b77c8626be757076807409b87d3)</sub>

#### Farmers Markets in the US

![farmer markets](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/markets.jpg)

<sub>Data source: [USDA](https://www.ams.usda.gov/local-food-directories/farmersmarkets) • [code](https://bl.ocks.org/larsvers/7f856d848e1f5c007553a9cea8a73538)</sub>

#### Post boxes in the UK

![postboxes](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/postboxes.jpg)

<sub>Data source: [dracos.co.uk](http://dracos.co.uk/) from [here](http://dracos.co.uk/made/locating-postboxes) via [Free GIS Data](https://freegisdata.rtwilson.com/) • [code](https://bl.ocks.org/larsvers/a05405dd9476e5842a1dbbc93b3d1cf7)</sub>

### Edge Cover

The tessellation aspect might become clear in these examples. The edge cover calculation might not. In short, _d3.hexgrid_ identifies all **edge hexagons** that partly lie beyond the borders of the geography, or more general: the base image presented. In a next step it calculates the edge hexagon's **cover**: the area the edge hexagon lies within the bounds of the base image in percent. Lastly, the **point density** will be calculated by:

_Point density = Points in hexagon / Hexagon area in px<sup>2</sup> &times; Cover_

A comparison:

![edge comparison](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/edge-compare.jpg)

Both maps encode the number of Farmer's Markets per hexagon. Yellow represents a low, purple a high number. The edge hexagons of the upper map are not cover corrected, the edge hexagons of the lower map are.

The edge hexagon at the south-eastern tip of Florida we're comparing has a cover of 55%, meaning 55% of the hexagon's area is inland, 45% is in the Atlantic. There are a total of 22 Farmer's Markets in this hexagon. Not cover corrected, the hexagon would have a point density of 0.09 and would be filled in a dark blue with the colour scale of choice. When cover corrected, its real point density increases to 0.17 and it is coloured in a dark purple&mdash;indicating higher point density as it should.

Differences might be subtle but noticeable.

Please see the d3-hexgrid's notebook [section on edge cover](https://beta.observablehq.com/@larsvers/hexgrid-maps-with-d3-hexgrid#coverChapter) for a detailed description of the cover calculation.

## Example usage

A lean example usage of _d3-hexgrid_.

```
// Container.
const svg = d3.select('body')
  .append('svg')
  .attr(width, 'width')
  .attr('height, 'height');

// Projection and path.
const projection = d3.geoAlbers().fitSize([width, height], geo);
const geoPath = d3.geoPath().projection(projection);

// Produce and configure the hexgrid instance.
const hexgrid = d3.hexgrid()
  .extent([width, height])
  .geography(geo)
  .projection(projection)
  .pathGenerator(geoPath);

// Get the hexbin generator and the layout.
const hex = hexgrid(myPointLocationData);

// Create a colour scale.
const colourScale = d3.scaleSequential(d3.interpolateViridis)
  .domain([...hex.grid.maxPoints].reverse());

// Draw the hexes.
svg.append('g')
  .selectAll('.hex')
  .data(hex.grid.layout)
  .enter()
  .append('path')
  .attr('class', 'hex')
  .attr('d', hex.hexagon())
  .attr('transform', d => `translate(${d.x}, ${d.y})`)
  .style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));
```

### Breaking the example down:

First, we create an `SVG` element. Let's assume our geography represents mainland US and comes in as a geoJSON called `geo`. We use an Albers projection to fit our SVG and finally get the appropriate path generator.

```
const svg = d3.select('body')
  .append('svg')
  .attr(width, 'width')
  .attr('height, 'height');

const projection = d3.geoAlbers().fitSize([width, height], geo);
const geoPath = d3.geoPath().projection(projection);
```

Next, we use `d3.hexgrid()` to produce a _hexgrid_ instance we creatively call `hexgrid`. We immediately configure it by passing in the extent, the GeoJSON, the projection and the path-generator.

```
const hexgrid = d3.hexgrid()
  .extent([width, height])
  .geography(geo)
  .projection(projection)
  .pathGenerator(geoPath);
```

Now we can call our _hexgrid_ instance passing in the data.

```
const hex = hexgrid(myPointLocationData);
```

This will return a hexbin generator as [`d3.hexbin()`](https://github.com/d3/d3-hexbin) does, augmented with an additional object called <a href="#grid-object" name="grid-object">`grid`</a>, which exposes the following properties:

![grid object](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/grid-object.jpg)

- `imageCenters` is an array of objects exposing at least the _x_, _y_ hexagon centre coordinates of the hexgrid in screen space.

- `layout` is an array of arrays, each sub-array representing a hexagon in the grid. Each sub-array holds all point locations per hexagon in an object exposing at least _x_ and _y_ pixel coordinates as well as aggregate values. Here's an example hexagon layout sub-array with three point locations (or _datapoints_):

  ![layout object](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/layout-object.jpg)

  The aggregate values per hexagon are:

  - `cover` is the percentage of this hexagon's area within the geography expressed as a number between 0 and 1.
  - `datapoints` is the number of points binned in the hexagon.
  - `datapointsWt` is the number of points weighted by the inverse cover.
  - `pointDensity` is the hexagon's point density.
  - `gridpoint` marks the hexagon as part of the initial hexgrid. This allows you to identify hexagons added by the data. Imprecise latitude and longitude data values can lead to the generation of hexagons just outside the hexgrid. _d3.hexgrid_ will still capture and produce them. But you can spot and treat them by filtering for `gridpoint === 0`.
  - `x` and `y` are the hexagon centre positions in pixel coordinates.

- `extentPoints` is the extent of point location counts over all hexagons in the form _[min number of points, max number of points]_.
- `extentPointsWeighted` is the extent of point location counts weighted by their cover over all hexagons in the form _[min number of weighted points, max number of weighted points]_.
- `extentPointDensity` is the extent of cover adjusted point density over all hexagons in the form _[min point density, max point density]_.

  These extents can be used to set a colour scale domain when encoding number of points or point density.

Working with points, for example, we might want to create the following colour scale:

```
const colourScale = d3.scaleSequential(d3.interpolateViridis)
  .domain([...hex.grid.maxPoints].reverse());
```

Here, we decide to encode the number of points per hexagon as colours along the spectrum of the [Viridis colour map](https://github.com/d3/d3-scale-chromatic#interpolateViridis) and create an appropriate colour scale. We reverse the extent (without modifying the original array) as we want to map the maximum value to the darkest colour, which the Viridis colour space starts with.

Finally, we build the visual:

```
svg.append('g')
  .selectAll('.hex')
  .data(hex.grid.layout)
  .enter()
  .append('path')
  .attr('class', 'hex')
  .attr('d', hexgrid.hexagon())
  .attr('transform', d => `translate(${d.x}, ${d.y})`)
  .style('fill', d => !d.datapoints ? '#fff' : colourScale(d.datapoints));
```

We use the `hex.grid.layout` to produce as many path's as there are hexagons&mdash;as we would with `d3.hexbin()`&mdash;now, however, making sure we have as many hexagons to cover our entire GeoJSON polygon. We draw each hexagon with with `hexgrid.hexagon()` and `translate` them into place. Lastly, we give our empty hexagons (`!d.datapoints`) a white fill and colour encode all other hexagons depending on their number of `datapoints`.

## API Reference

<a href="#hexgrid" name="hexgrid">#</a> d3.<b>hexgrid</b>()

Constructs a hexgrid generator called _hexgrid_ in the following. To be configured before calling it with the data you plan to visualise.

<a href="#hex" name="hex">#</a> _hexgrid_(_data_[, _names_])

Generates a hexbin generator augmented with a `grid` property, exposing the hexagon layout data as well as extents for point and point density measures. [See above for the `grid` object's properties](#grid-object). Optionally _names_ can be an array of strings, listing properties you would like to pass through from your original data to the grid layout.

Assuming you want to visualise restaurants on a map and have a restaurant dataset containing the variables `website` and `opening_times` you can say:

```
hexgrid(restaurantData, ['website', 'opening_times'])
```

As a result, objects in the <code>_hexgrid_.grid.layout</code> array will contain the two variables in addition to the default _x_ and _y_ coordinates:

![layout-object-vars](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/layout-object-vars.jpg)

<a href="#hex-extent" name="hex-extent">#</a> _hexgrid._<b>extent</b>([_extent_])

_Required_. Sets the extent of the hexbin generator produced internally. _extent_ can come as either a 2D array specifying top left start and bottom right end point [[x₀, y₀], [x₁, y₁]]. Alternatively _extent_ can be specified as an array of just width and height [x₁, y₁] with the top-left corner assumed to be [0, 0]. The following two statements are equivalent:

```
hexgrid.extent([[0, 0], [width, height]]);
hexgrid.extent([width, height]);
```

<a href="#hex-geography" name="hex-geography">#</a> _hexgrid._<b>geography</b>([_object_])

_Required_. _object_ represents the base polygon for the hexgrid in GeoJSON format. If you were to project a hexgrid onto Bhutan, _object_ would be a GeoJSON object of Bhutan.

<a href="#hex-projection" name="hex-projection">#</a> _hexgrid._<b>projection</b>([_projection_])

_Required_. _projection_ is the projection function for the previously defined [_geography_](#hex-geography) commonly specified within the bounds of [_extent_](#hex-extent). See [here](https://github.com/d3/d3-geo) or [here](https://github.com/d3/d3-geo-projection) for a large pond of projection functions.

<a href="#hex-pathGenerator" name="hex-pathGenerator">#</a> _hexgrid._<b>pathGenerator</b>([_path_])

_Required_. _path_ is the path generator to produce the drawing instructions of the previously defined [_geography_](#hex-geography) based on the also previously defined [_projection_](#hex-projection).

<a href="#hex-hexRadius" name="hex-hexRadius">#</a> _hexgrid._<b>hexRadius</b>([_radius_[, _unit_]])

_Optional_. The desired hexagon radius in pixel. Defaults to 4. _unit_ can optionally be specified if the radius should be expressed not in pixel but in either _"miles"_ or _"kilometres"_. The following is valid configuration:

```js
.hexRadius(50, 'm')   // or 'miles'
.hexRadius(50, 'km')  // or 'kilometres' or 'kilometers'
```

The conversion is based on a [`geoCircle`](https://github.com/d3/d3-geo#geoCircle) projected in the center of the drawing area. As such the conversion can only be a proxy, however, a good one if an equal area projection is used to minimise area distortions across the geography.

<a href="#hex-edgePrecision" name="hex-edgePrecision">#</a> _hexgrid._<b>edgePrecision</b>([_precision_])

_Optional_. The edge precision sets the size of the internally produced canvas to identify which area of the edge hexagon is covered by the [_geography_](#hex-geography). The higher the precision, the better the pixel detection at the hexagon edges. Values can be larger than 1 for small visuals. Values smaller than 0.3 will be coerced to 0.3. The default value of 1 will be fine for most purposes.

<a href="#hex-gridExtend" name="hex-gridExtend">#</a> _hexgrid._<b>gridExtend</b>([_extension_])

_Optional_. _gridExtend_ controls the size of the base geography. _gridExtend_ allows you to "inflate" your hexgrid and can be used to draw more hexagons around the edges that otherwise would not be drawn.

![gridExtend](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/gridExtend.jpg)

_gridExtend_ is measured in units of _hexRadius_. For example, a _gridExtend_ value of 2 would extend the grid by _2 &times; hexRadius_ pixel.

<a href="#hex-geoKeys" name="hex-geoKeys">#</a> _hexgrid._<b>geoKeys</b>([_keys_])

_Optional_. _d3.hexgrid_ will try to guess the key names for longitude and latitude variables in your data. The following case-insensitive key names will be sniffed out:

- _longitude_, _long_, _lon_, _lng_, _lambda_ as well as
- _latitude_, _lat_ and _phi_.

If you choose other names like for example _upDown_ and _leftRight_, you
have to specify them as <code><i>hexgrid</i>.geokeys(['upDown', 'leftRight'])</code> with the first element representing longitude and the second latitude.

Don't call your geo keys `x` or `y` or otherwise include `x` and/or `y` keys in your passed in user variables as they are reserved keys for the pixel coordinates of the layout.

### Helper functions

The following functions can be helpful to filter out point location data that lie beyond the base geography.

<a href="#d3-geoPolygon" name="d3-geoPolygon">#</a> d3.<b>geoPolygon</b>([_geo_, _projection_])

Transforms a GeoJSON geography into a Polygon or MultiPolygon. _geo_ is a GeoJSON of the base geography. _projection_ is the applied projection function.

<a href="#d3-polygonPoints" name="d3-polygonPoints">#</a> d3.<b>polygonPoints</b>([_data_, _polygon_])

_data_ is an array of point location objects with _x_ and _y_ properties in screen space. _polygon_ is a Polygon or MultiPolygon as produced by [`d3.geoPolygon()`](#d3-geoPolygon). Returns a new array of point location objects exclusively within the bounds of the specified _polygon_.

If you had a point location dataset of all post boxes in the world, but you only want to visualise UK post boxes you can use these helper functions to produce a dataset with only UK post boxes like so:

```
const polygonUk   = d3.geoPolygon(ukGeo, projectionUk);
const postboxesUk = d3.polygonPoints(postboxesWorld, polygonUk);
```

If you plan to use the d3-hexgrid produced extents in a color scale, it is suggested to focus your dataset on your base geography. If produced with data beyond your base geography, the extents might not be meaningful.

## General notes on hexagonal binning

Hexagons are often ideal for binning point location data as they are the shape closest to circles that can be regularly tessellated. As a result, point distributions binned by a hexagon are [relatively spike-less](https://beta.observablehq.com/@larsvers/making-a-tesselated-hexbin-map) and [neighbouring hexagons are equidistant](https://uber.github.io/h3/#/documentation/overview/use-cases).

While being the right choice in many cases, two notes should be considered when using hexagonal binning&mdash;or any point location binning for that matter:

#### Use equal area projections for the base geography.

The world is [something like a sphere](https://en.wikipedia.org/wiki/Spheroid) and there are numerous ways to project a sphere onto a 2D plane. The projection used has an important effect on the analysis. Any tessellation normalises space to equally sized units&mdash;hexagons in this case&mdash;which invites the reader to assume that each unit covers the same area. However, some projections, like the ubiquitous Mercator projection, will distort area increasingly towards the poles:

![mercator](https://raw.githubusercontent.com/larsvers/image-store/master/d3-hexgrid/mercator.jpg)

<sub>Source: [D3 in depth](http://d3indepth.com/geographic/) by [Peter Cook](http://animateddata.co.uk/)

All red circles on above map are of the same area. As a result, tessellating a Mercator world map with hexagons will produce many more hexagons per square mile in Norway compared to Brazil, for example.

[Equal area projections](https://github.com/d3/d3-geo-projection#geoConicEqualArea) will help to avoid this problem to a large extent.

#### Consciously choose the hexagon radius size.

Location binning is susceptible to the [Modifiable Areal Unit Problem](https://blog.cartographica.com/blog/2011/5/19/the-modifiable-areal-unit-problem-in-gis.html). The MAUP&mdash;or more specifically the _zonal_ MAUP&mdash;states that a change in size of the analysis units can lead to different results. In other words, changing the hexagons’ size can produce significantly different patterns&mdash;although the views across different sizes share the same data. Awareness is the only corrective to the MAUP. As such, it is recommended to test a few unit sizes before consciously settling for one, stating the reasons why and/or allowing the readers to see or chose different hexagon sizes.

## Thanks!

A big thanks to [Philippe Rivière](https://illisible.net/philippe-riviere) for bringing the grid layout algorithm on track and sparking the idea for the edge cover calculation. This plug-in would look different and be significantly less performant without his elegant ideas.

For a deeper dive read [Amit Patel](http://www-cs-students.stanford.edu/~amitp/)'s (aka [reblobgames](https://www.redblobgames.com/)) seminal [hexagon tutorial](http://www.redblobgames.com/grids/hexagons/). The best to find out there. Also see the great things Uber's been doing with [H3](https://uber.github.io/h3/#/), which in many ways goes far beyond this plugin.
