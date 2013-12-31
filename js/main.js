
createWorldMap();

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
};

function handleCountrySelect(countryElement, countryData) {
    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

};

function createWorldMap() {
    // The map dimensions
    var mapWidth = 960;
    var mapHeight = 480;

    // Details of the map projection
    var projection = d3.geo.equirectangular()
        .scale(153)
        .translate([mapWidth / 2, mapHeight / 2])
        .precision(0.1);

    var path = d3.geo.path()
        .projection(projection);

    // Load the map data and draw the map
    var svg = d3.select('#drawingArea');
    d3.json("data/worldMap.json", function(error, world) {
        var prevCountryElement;
        svg.selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .attr('title', function(d) {
                return d.properties.name;
            })
            .on('mouseup', function(d) {
                if(prevCountryElement)
                    handleCountryDeselect(prevCountryElement);
                handleCountrySelect(this, d);
                prevCountryElement = this;
            });
    });
}

