
var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';

var audioPlaylist = null;
var audioPlayListLoader = new AudioPlayListLoader();
var audioPlayer = null;

var prevCountryElement = null;

document.addEventListener("DOMContentLoaded", function(event) { 
    createAudioPlayer();
    
    var drawingArea = document.getElementById("drawingArea");
    drawingArea.addEventListener('load', bindWorldMap);
});

function bindWorldMap() {
    console.log('World map loaded');

    var svgDoc = drawingArea.contentDocument;

    var worldMap = new WorldMap(svgDoc);
    worldMap.init();

    worldMap.bind('select', playAudioFromCountry);
}

function playAudioFromCountry(niceCountryName) {
    audioPlaylist.clear();

    d3.select('#countryName').text(niceCountryName);

    audioPlayListLoader.loadPlaylist(audioPlaylist, niceCountryName)
        .then(function() {
            audioPlaylist.play();
        })
        .catch(function(error) {
            alert('Oh no! Something\'s gone wrong and a playlist for the ' + 
                  'country can\'t be loaded. Please try another country or ' + 
                  'try again at a later time.');
            console.error(error);
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

