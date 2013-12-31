
var mapWidth = 960;
var mapHeight = 480;

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([mapWidth / 2, mapHeight / 2])
    .precision(0.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select('#drawingArea');

svg.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path);

d3.json("js/lib/world-50m.json", function(error, world) {
  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});

