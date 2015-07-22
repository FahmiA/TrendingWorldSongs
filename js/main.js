
var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';

var audioPlaylist = null;
var audioPlayListLoader = new AudioPlayListLoader();
var audioPlayer = null;

document.addEventListener("DOMContentLoaded", function(event) { 
    createAudioPlayer();
    
    var drawingArea = document.getElementById("drawingArea");
    drawingArea.addEventListener('load', connectWorldMap);
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
            audioPlaylist.play();
        })
        .fail(function(error) {
            alert('Oh no! Something\'s gone wrong and a playlist for the ' + 
                  'country can\'t be loaded. Please try another country or ' + 
                  'try again at a later time.');
            console.error(error);
        })
        .done();
}

function connectWorldMap() {
    console.log('World map loaded');

    var prevCountryElement;
    var svgDoc = drawingArea.contentDocument;
    d3.select(svgDoc).select('#Countries').selectAll('g')
        .on('click', function() {
            var countryName = this.id;

            if(prevCountryElement) {
                handleCountryDeselect(prevCountryElement);
            }
            var d = {
                properties: {
                    name: countryName
                }
            };
            handleCountrySelect(this, d);
            prevCountryElement = this;
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
