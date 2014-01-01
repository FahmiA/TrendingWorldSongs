
var audioPlaylist = null;
var audioPlayer = null;

createAudioPlayer();
createWorldMap();

function handleCountryDeselect(countryElement) {
    d3.select(countryElement)
        .classed('country-selected', false);
};

function handleCountrySelect(countryElement, countryData) {
    // Display the country as selected
    d3.select(countryElement)
        .classed('country-selected', true);

    var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';
    var echonestQuery = 'http://developer.echonest.com/api/v4/song/search?api_key=' + ECHONEST_API_KEY + '&format=json&description=' + countryData.properties.name + '&sort=song_hotttnesss-desc&bucket=id:7digital-US&bucket=tracks';

    d3.json(echonestQuery, function(error, data) {
        var status = data.response.status;
        if(status.code !== 0) {
            console.log(data);
            alert('Could not retrieve trending songs from ' + countryData.properties.name);
        }else{
            var songs = data.response.songs;
            updateAudio(songs);
        }
    });
};

function updateAudio(songs) {
    audioPlaylist.clear();

    var song, track;
    for(var i = 0; i < songs.length; i++) {
        song = songs[i];
        for(var j = 0; j < song.tracks.length; j++) {
            track = song.tracks[j];
            audioPlaylist.addSong(song.title, song.artist_name, track.preview_url, track.release_image);
            break; // Experimental - only accept first track
        }
    }
    
    audioPlaylist.play();
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

//var AudioPlayer = function(playButton, prevButton, nextButton, titleSpan, artistSpan, playlist) {
function createAudioPlayer() {
    audioPlaylist = new AudioPlaylist(d3.select('#audio').node());
    audioPlayer = new AudioPlayer(d3.select('#playPause'), d3.select('#prevTrack'), d3.select('#nextTrack'),
                                  d3.select('#songThumbnail'), 
                                  d3.select('#songTitle'), d3.select('#songArtist'),
                                  audioPlaylist);
    audioPlayer.init();
}
