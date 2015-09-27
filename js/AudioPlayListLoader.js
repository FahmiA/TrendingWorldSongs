
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
                    .then(this._getArtists.bind(this))
                    .then(this._updatePlaylist.bind(this, audioPlaylist));
    },

    _queryCountry: function(countryName) {
        var queryableCountryName = this._getQueryableCountryName(countryName);

        var url = new SimpleURL('http://128.199.193.50:6081/api/v4/artist/search');
        url.addParameter('api_key', ECHONEST_API_KEY)
           .addParameter('artist_location', '^' + queryableCountryName)
           .addParameter('sort', 'hotttnesss-desc')
           .addParameter('bucket', 'urls');

        var echonestQuery = url.toString();

        return new Promise(function(resolve, reject) {
            d3.json(echonestQuery, function(error, data) {
                var errorMessage = EchoNestUtil.validateResponse(data, countryName);
                if(errorMessage) {
                    reject(errorMessage);
                }else{
                    resolve(data.response.artists);
                }
            });
        });
    },

    _getQueryableCountryName: function(countryName) {
        if(this.COUNTRY_QUERY_MAP[countryName]) {
            countryName = this.COUNTRY_QUERY_MAP[countryName];
        }

        return countryName;
    },

    _getArtists: function(artistsJson) {
        var artists = artistsJson.map(function(artistJson) {
            var url = this._getURL(artistJson.urls);
            return new Artist(artistJson.name, artistJson.id, url);
        }, this);

        return artists;
    },

    _getURL: function(urlJson) {
        var url = '#';
        
        if(urlJson) {
            url = urlJson.wikipedia_url || urlJson.official_url || urlJson.lastfm_url;
        }

        return url;
    },

    _updatePlaylist: function(audioPlaylist, artists) {
        artists.forEach(function(artist) {
            audioPlaylist.addArtist(artist);
        });
    },

};

