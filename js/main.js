
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
    var countryID = this.id;

    if(prevCountryElement) {
        handleCountryDeselect(prevCountryElement);
    }

    displayNote(this);
    handleCountrySelect(this, countryID);
    prevCountryElement = this;
}

function displayNote(element) {
    var note = document.getElementById('note');
    if(!note) {
        return;
    }

    var box = element.getBoundingClientRect();
    var noteHeight = 50;
    var noteWidth = 50;
    d3.select(note)
        .classed('hidden', false)
        .style('left', (box.left + (box.width / 2) -  (noteWidth / 2)) + 'px')
        .style('top', (box.top + (box.height / 2) -  (noteHeight / 2)) + 'px')
        .style('width', noteWidth + 'px')
        .style('height', noteHeight + 'px');
}

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
}

function handleCountrySelect(countryElement, countryID) {
    var countryName = getCountryName(countryID);
    var niceCountryName = getNiceCountryName(countryID);

    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

    // Hide all scribbles
    var svgDoc = drawingArea.contentDocument;
    var scribbles = d3.select(svgDoc).select('#scribbles').selectAll('g');
    scribbles.classed('scribble-selected', false);

    var scribbleId = '#Scribble-' + countryName;
    var selectedScribble = d3.select(svgDoc).select('#scribbles').select(scribbleId);
    selectedScribble.classed('scribble-selected', true);

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

function connectWorldMap() {
    console.log('World map loaded');

    var svgDoc = drawingArea.contentDocument;
    d3.select(svgDoc).select('#Countries').selectAll('g')
        .on('click', debounce(handleCountryClick))
        .append('title')
        .text(function() {
            return getNiceCountryName(this.parentNode.id);
        });
}

function getCountryName(countryID) {
    return countryID.replace(/^Country-/, '');
}

function getNiceCountryName(countryID) {
    var name = getCountryName(countryID)
                    .replace(/_/g, ' ')
                    .toLowerCase();

    name = capitalize(name);
    return name;
}

function capitalize(s) {
    return s.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
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
