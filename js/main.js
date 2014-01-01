
createWorldMap();

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
};

function handleCountrySelect(countryElement, countryData) {
    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

    var ECHONEST_API_KEY = 'ADD API KEY HERE';
    var echonestQuery = 'http://developer.echonest.com/api/v4/song/search?api_key=' + ECHONEST_API_KEY + '&format=json&description=' + countryData.properties.name + '&sort=song_hotttnesss-desc&bucket=id:7digital-US&bucket=tracks';

    d3.json(echonestQuery, function(error, data) {
        var status = data.response.status;
        if(status.code !== 0) {
            console.log(data);
            alert('Could not retrieve trending songs from ' + countryData.properties.name);
        }else{
            var songs = data.response.songs;
            console.log(songs);

            var audio = d3.select('#audio').node();
            audio.pause();
            audio.src = songs[0].tracks[0].preview_url;
            audio.play();
        }
    });

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

