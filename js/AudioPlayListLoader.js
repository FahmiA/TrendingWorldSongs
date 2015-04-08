
var AudioPlayListLoader = function() {
};

AudioPlayListLoader.prototype = {
    COUNTRY_QUERY_MAP: {
        'united states of america': 'united states',
        'united republic of tanzania': 'tanzania',
        'republic of serbia': 'serbia'
    },

    loadPlaylist: function(audioPlaylist, countryName) {
        return this._queryCountry(countryName)
                    .then(this._getSongs.bind(this))
                    .then(this._updatePlaylist.bind(this, audioPlaylist));
    },

    _queryCountry: function(countryName) {
        var queryableCountryName = this._getQueryableCountryName(countryName);

        var url = new SimpleURL('http://developer.echonest.com/api/v4/artist/search');
        url.addParameter('api_key', ECHONEST_API_KEY)
           .addParameter('artist_location', '^' + queryableCountryName)
           .addParameter('sort', 'hotttnesss-desc')
           .addParameter('bucket', 'songs')
           .addParameter('bucket', 'urls');

        var echonestQuery = url.toString();

        var deferred = Q.defer();
        d3.json(echonestQuery, function(error, data) {
            var errorMessage = EchoNestUtil.validateResponse(data, countryName);
            if(errorMessage) {
                deferred.reject(errorMessage);
            }else{
                deferred.resolve(data.response.artists);
            }
        });

        return deferred.promise;
    },

    _getQueryableCountryName: function(countryName) {
        if(this.COUNTRY_QUERY_MAP[countryName]) {
            countryName = this.COUNTRY_QUERY_MAP[countryName];
        }

        return countryName;
    },

    _getSongs: function(artistsJson) {
        var deferred = Q.defer();

        var songsList = [];
        var songsMap = {};

        artistsJson.forEach(function(artist) {
            var artistName = artist.name;
            var artistId = artist.id;
            var artistURL = this._getURL(artist.urls);
            artist.songs = artist.songs || []; // artist.songs may, on occasion, not exist

            artist.songs.forEach(function(song) {
                var artistSongId = artistId + song.title;

                var songObj = songsMap[artistSongId];
                if(!songObj) {
                    songObj = new Song(song.title, artistName, artistURL);

                    songsList.push(songObj);
                    songsMap[artistSongId] = songObj;

                }

                songObj.addId(song.id);
            });
        }.bind(this));

        deferred.resolve(songsList);

        return deferred.promise;
    },

    _getURL: function(urlJson) {
        var url = null;
        
        if(urlJson) {
            url = urlJson.wikipedia_url || urlJson.official_url || urlJson.lastfm_url || '#';
        }

        return url;
    },

    _updatePlaylist: function(audioPlaylist, songs) {
        songs.forEach(function(song) {
            audioPlaylist.addSong(song);
        });

        audioPlaylist.shuffle();
    },

};

