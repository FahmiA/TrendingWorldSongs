
var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';

var audioPlaylist = null;
var audioPlayListLoader = new AudioPlayListLoader();
var audioPlayer = null;

document.addEventListener("DOMContentLoaded", function(event) { 
    createAudioPlayer();
    createWorldMap();
});

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
}

function handleCountrySelect(countryElement, countryData) {
    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

    audioPlaylist.clear();

    var countryName = countryData.properties.name.toLowerCase();

    d3.select('#countryName').text(countryName);

    audioPlayListLoader.loadPlaylist(audioPlaylist, countryName)
        .then(function() {
            //alert('yay');
            audioPlaylist.play();
        })
        .fail(function(message) {
            alert(message || 'Oh no!');
            console.log(arguments);
        });
}

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
        if(!world) {
            alert('Could not load world map. Try again later.');
            console.log(world);
            return;
        }

        var prevCountryElement;
        svg.selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .on('mouseup', function(d) {
                if(prevCountryElement) {
                    handleCountryDeselect(prevCountryElement);
                }
                handleCountrySelect(this, d);
                prevCountryElement = this;
            })
            .append('title')
            .text(function(d) {
                return d.properties.name;
            });
    });
}

function createAudioPlayer() {
    audioPlaylist = new AudioPlaylist(d3.select('#audio').node());

    audioPlayer = new AudioPlayer({
        playButton: d3.select('#playTrack'),
        prevButton: d3.select('#prevTrack'),
        nextButton: d3.select('#nextTrack'),
        thumbnailDiv: d3.select('#songThumbnail'),
        songInfoSentence: d3.select('#songInfoSentence'),
        titleSpan: d3.select('#songTitle'),
        artistSpan: d3.select('#songArtist'),
        songLoadSentence: d3.select('#songLoadSentence'),
        loadingSpan: d3.select('#songLoad'),
        playlist: audioPlaylist
    });

    audioPlayer.init();
}
