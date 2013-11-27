
var width = 960,  // SVG area width
    height = 600, // And height
    size = 1;     // Crime marker size.

// Creating the projection of the Philadelphia perimeter.
var projection = d3.geo.azimuthalEqualArea()
    .scale(110000)
    .translate([-350, 75])
    .rotate([71, -45])
    .center([-3.6076, -4.7913]);

// Setting the projection.
var path = d3.geo.path()
    .projection(projection);

// Selecting the original SVG area within the browser window.
var svg = d3.select("#display")
    .attr("width", width)
    .attr("height", height);

// Loading the map data.  This data is in a JSON file located in the same directory as the web page.
// Note that the data must be served over HTTP; we cannot execute data loads via the filesystem.
d3.json("philadelphia.json", function(error, philadelphia) {

  svg.append('path')
    .datum(topojson.feature(philadelphia, philadelphia.objects.philadelphia))
    .attr('id', 'philadelphia')
    .attr('d', path);

});

d3.select(self.frameElement).style("height", height + "px");

// Loading and displaying the crime data.
d3.csv('philly-crime.csv', function(data) {

  d3.select('svg').selectAll('circle')
    .data(data, function(d) { return d.longitude.toString() + d.latitude.toString(); })
    .enter().append('circle')
      .attr('cx', function (d) { return projection([d.longitude, d.latitude])[0]; })
      .attr('cy', function (d) { return projection([d.longitude, d.latitude])[1]; })
      .attr('r', function(d) { return size; })
      .attr('fill', function(d) { return 'red'; });

});