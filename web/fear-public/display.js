
var width = 960,                          // SVG area width
    height = 600,                         // And height
    startDate = new Date(2013, 0, 4, 14), // The original time, used to reset
    dateGate = new Date(startDate),                 // This is used as the initial time; it is incremented during the animation
    fearData,                             // A reference to the ingested and pre-processed data
    timeStep = 86400000 / 12,             // 1 hour in millisecs = 3600000 ms, 1 day = 86400000 ms
    intervalStep = 250,                   // The real duration of an animation step, in millisections
    duration = 500,                       // The duration of an initial event bloom
    bloomSize = 10,                       // The maximum size of the generated bloom
    initialSize = 1,                      // The initial bloom size
    finalSize = 1,                        // The bloom reminant size
    bloomOpacity = 0,                     // The final opacity of the bloom
    colors = {};                          // An object literal used as an associative array to contain colors for events
    isPaused = true;

// Color table for events.
colors['evtype1'] = 'red';
colors['evtype2'] = 'green';
colors['evtype3'] = 'yellow';
colors['evtype4'] = 'orange';
colors['evtype5'] = 'white';

// Creating the map projections into which we will load map data.
var projection = d3.geo.azimuthalEqualArea()
    .scale(width)
    .translate([33.5, 262.5])
    .rotate([100, -45])
    .center([-17.6076, -4.7913])
    .scale(1297);

// Setting the projection.
var path = d3.geo.path()
    .projection(projection);

// Creating the original SVG area within the browser window.
// var svg0 = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

var svg = d3.select("#display")
    .attr("width", width)
    .attr("height", height);

// Loading the map data.  This data is in a JSON file located in the same directory as the web page.
// Note that the data must be served over HTTP; we cannot execute data loads via the filesystem.
d3.json("us.json", function(error, us) {

  var defs = svg.append("defs");

  defs.append("path")
      .datum(topojson.feature(us, us.objects.states))
      .attr("id", "states")
      .attr("d", path);

  svg.append("clipPath")
      .attr("id", "clip")
    .append("use")
      .attr("xlink:href", "#states");

  svg.append("use")
      .attr("xlink:href", "#states");

});

d3.select(self.frameElement).style("height", height + "px");

function parseFearData(data) {
  // Loop through the raw data, parse dates, and create date objects based on those dates.
  for (var i = 0; i < data.length; i++) {
    var date = data[i].date,
      dte = date.split(' ')[0].split('/'),
      tme = date.split(' ')[1].split(':'),
      dateObj = new Date(dte[2], dte[0] - 1, dte[1], tme[0], tme[1]);
    data[i].date = dateObj;
  }
  return data; 
}

// Here, we load the FEAR data and preprocess, converting string date/time representations into
// data objects which we can then more easily order.
d3.csv("fear.csv", function(data) { 
  // Saving the preprocessed data.
  fearData = parseFearData(data);
});

// Filtering data by date.
function filterData(data, date) {
  // A stack to store valid data.
  var validData = [];

  // If an event has occured prior to the input
  // date, push it onto the validData stack.
  for (var i = 0; i < data.length; i++) {
    if (data[i].date <= date) {
      validData.push(data[i]);
    }
  }
  console.log(validData.length);

  // Return valid information.
  return validData;
}

// Incrementing a date by a submitted number of milliseconds.
function incrementTime(millis, date) {
  date.setTime(date.getTime() + millis);
  return date;
} 

// Pausing or continuing an animation.
function pauseAnimation() {
  isPaused = !isPaused;
  if (isPaused) {
    d3.select('#pauseButton').html('continue');
  } else {
    d3.select('#pauseButton').html('pause');
  }
}

// Starting an animation.
function startAnimation() {
  isPaused = false;
  dateGate = new Date(startDate);

  // Setting disabled state.
  document.getElementById('pauseButton').disabled = false;
  document.getElementById('startButton').disabled = true;

  // Remove the old SVG element.
  var s = d3.select('svg');
  s.remove();

  var svg = d3.select("#display-container").append("svg")
    .attr("width", width)
    .attr("height", height);

  // Load new map data.
  d3.json("us.json", function(error, us) {

    var defs = svg.append("defs");

    defs.append("path")
        .datum(topojson.feature(us, us.objects.states))
        .attr("id", "states")
        .attr("d", path);

    svg.append("clipPath")
        .attr("id", "clip")
      .append("use")
        .attr("xlink:href", "#states");

    svg.append("use")
        .attr("xlink:href", "#states");

  });

  intervalId = setInterval(function() {

    if (isPaused) return;

    // Filter and increment the date.
    var data = filterData(fearData, dateGate);
    dateGate = incrementTime(timeStep, dateGate);

    // Add new data to the map.  This will create an initial bloom showing event detection,
    // after which the event will remain on the map, color-coded based on event type.
    d3.select('svg').selectAll('circle')
      .data(data, function(d) { return d.id; })
      .enter().append('circle')
        .attr('cx', function (d) { return projection([d.longitude, d.latitude])[0]; })
        .attr('cy', function (d) { return projection([d.longitude, d.latitude])[1]; })
        .attr('r', function(d) { return initialSize; })
        .attr('fill', function(d) { return colors[d.type]; })
      .transition()
        .attr('r', function(d) { return bloomSize; })
        .duration(duration)
        .style('opacity', bloomOpacity)
      .transition()
        .attr('r', function(d) { return finalSize; })
        .attr('fill', function(d) { return colors[d.type]; })
        .duration(1)
        .style('opacity', 1);

    d3.select('#simDate').html(dateGate);

    if (data.length >= fearData.length) {
      console.log('finished.');
      document.getElementById('pauseButton').disabled = true;
      document.getElementById('startButton').disabled = false;
      clearInterval(intervalId);
    }

  }, intervalStep);

}