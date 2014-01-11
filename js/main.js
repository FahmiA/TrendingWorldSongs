
var audioPlaylist = null;
var audioPlayer = null;
var ECHONEST_API_KEY = 'KVBFT8M5F51MGFGCF';

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

    var country = countryData.properties.name.replace(/\W+/g, '+').toLowerCase();
    var echonestQuery = 'http://developer.echonest.com/api/v4/song/search?api_key=' + ECHONEST_API_KEY + '&format=json&description=' + country + '&sort=song_hotttnesss-desc&bucket=id:7digital-US&bucket=tracks';
    //var echonestQuery = 'http://developer.echonest.com/api/v4/song/search?api_key=' + ECHONEST_API_KEY + '&format=json&description=location:' + country + '&sort=song_hotttnesss-desc&bucket=id:7digital-US&bucket=tracks';

    d3.json(echonestQuery, function(error, data) {
        if(!data || data.response.status.code !== 0) {
            alert('Could not retrieve trending songs from ' + countryData.properties.name + '. Try again later.');
            console.log(data);
        }else{
            // Update the songs to play
            var songs = data.response.songs;
            updateAudio(songs);

            // Update the country display
            d3.select('#countryName').text(countryData.properties.name);
        }
    });
};

function updateAudio(songs) {
    audioPlaylist.clear();

    var song, track;
    for(var i = 0; i < songs.length; i++) {
        song = songs[i];
        // Take only the first track
        if(song.tracks.length > 0) {
            track = song.tracks[0];
            audioPlaylist.addSong(song.title, song.artist_name, song.artist_id,
                                  track.preview_url, track.release_image);
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
                if(prevCountryElement)
                    handleCountryDeselect(prevCountryElement);
                handleCountrySelect(this, d);
                prevCountryElement = this;
            })
            .append('title')
            .text(function(d) {
                return d.properties.name;
            });
    });
}

//var AudioPlayer = function(playButton, prevButton, nextButton, titleSpan, artistSpan, playlist) {
function createAudioPlayer() {
    audioPlaylist = new AudioPlaylist(d3.select('#audio').node());
    audioPlayer = new AudioPlayer(d3.select('#playTrack'), d3.select('#prevTrack'), d3.select('#nextTrack'),
                                  d3.select('#songThumbnail'), 
                                  d3.select('#songTitle'), d3.select('#songArtist'),
                                  audioPlaylist);
    audioPlayer.init();
}
