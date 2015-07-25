
var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';

var audioPlaylist = null;
var audioPlayListLoader = new AudioPlayListLoader();
var audioPlayer = null;

var prevCountryElement = null;

document.addEventListener("DOMContentLoaded", function(event) { 
    createAudioPlayer();
    
    var drawingArea = document.getElementById("drawingArea");
    drawingArea.addEventListener('load', connectWorldMap);
});

function handleCountryClick() {
    var countryName = this.id;

    if(prevCountryElement) {
        handleCountryDeselect(prevCountryElement);
    }

    handleCountrySelect(this, countryName);
    prevCountryElement = this;
}

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
}

function handleCountrySelect(countryElement, countryName) {
    countryName = countryName.toLowerCase();
    countryName = countryName.replace(/_/g, ' ');

    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

    audioPlaylist.clear();

    d3.select('#countryName').text(countryName);

    audioPlayListLoader.loadPlaylist(audioPlaylist, countryName)
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

function connectWorldMap() {
    console.log('World map loaded');

    var svgDoc = drawingArea.contentDocument;
    d3.select(svgDoc).select('#Countries').selectAll('g')
        .on('click', debounce(handleCountryClick))
        .append('title')
        .text(function() {
            return this.parentElement.id.replace(/_/g, ' ');
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

function debounce(fn, delay) {
// http://codereview.stackexchange.com/questions/58406/function-buffer-to-avoid-triggering-an-event-handler-too-frequently
    var timeout;

    return function () {
        var context = this,
            args = arguments;

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(context, args);
        }, delay || 250);
    };
}
