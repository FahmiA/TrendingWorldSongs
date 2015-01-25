
var AudioPlayListLoader = function() {
};

AudioPlayListLoader.prototype = {
    loadPlaylist: function(audioPlaylist, countryName) {
        return this._queryCountry(countryName)
                    .then(this._getSongs.bind(this))
                    .then(this._updatePlaylist.bind(this, audioPlaylist));
    },

    _queryCountry: function(countryName) {
        var url = new SimpleURL('http://developer.echonest.com/api/v4/artist/search');
        url.addParameter('api_key', ECHONEST_API_KEY)
           .addParameter('artist_location', '^' + countryName)
           .addParameter('bucket', 'songs')
           .addParameter('sort', 'hotttnesss-desc');

        var echonestQuery = url.toString();

        var deferred = Q.defer();
        d3.json(echonestQuery, function(error, data) {
            if(!data || data.response.status.code !== 0) {
                deferred.reject('Could not retrieve trending songs from ' + countryName + '. Please try again later.');
            }else{
                deferred.resolve(data.response.artists);
            }
        });

        return deferred.promise;
    },

    _getSongs: function(artistsJson) {
        var deferred = Q.defer();

        var songsList = [];
        var songsMap = {};

        artistsJson.forEach(function(artist) {
            var artistName = artist.name;
            var artistId = artist.id;

            artist.songs.forEach(function(song) {
                var artistSongId = artistId + song.title;

                var songObj = songsMap[artistSongId];
                if(!songObj) {
                    songObj = new Song(song.title, artistName);

                    songsList.push(songObj);
                    songsMap[artistSongId] = songObj;

                }

                songObj.addId(song.id);
            });
        });

        deferred.resolve(songsList);

        return deferred.promise;
    },

    _updatePlaylist: function(audioPlaylist, songs) {
        songs.forEach(function(song) {
            audioPlaylist.addSong(song);
        });

        audioPlaylist.shuffle();
    },

};

