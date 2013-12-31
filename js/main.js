
var mapWidth = 960;
var mapHeight = 480;

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([mapWidth / 2, mapHeight / 2])
    .precision(0.1);

var path = d3.geo.path()
    .projection(projection);


var svg = d3.select('#drawingArea');

/*var graticule = d3.geo.graticule();
svg.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path);*/

d3.json("data/worldMap.json", function(error, world) {
  svg.selectAll('path')
    .data(world.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'country');
});

