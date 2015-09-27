
var TrackLoader = function() {
};

TrackLoader.prototype = {
    load: function(artist) {
        console.log('Retrieving songs for artist ' + artist.toString());
        if(artist.hasSongsLoaded()) {
            console.log('    Songs cached');
            return Promise.resolve();
        }

        console.log('    Fetching artist songs');

        // Fetch the song tracks
        return this._getSongs(artist)
                .then(this._filterSongsWithPreviewURL)
                .then(this._updateArtist.bind(this, artist));
    },

    getAuthenticatedURL: function(url) {
        /* For reference see:
         *  https://github.com/bettiolo/oauth-signature-js
         *  http://developer.7digital.com/resources/api-docs/oauth-authentication
         */

        var httpMethod = 'GET';
        var parameters = {
            oauth_consumer_key : '7de4hxbw4w7t',
            oauth_nonce : +new Date(), // Generate a random number
            oauth_timestamp : parseInt(new Date().getTime() / 1000), // Divide by 1000 to get seconds
            oauth_signature_method : 'HMAC-SHA1',
            oauth_version : '1.0',
            country: 'GB' // 7Digital requires an additional country code parameter which the EchoNest does not provide
        };
        var consumerSecret = '5wnnqdvnpdfrehfv';
        var tokenSecret = '';

        // generates a RFC3986 encoded, BASE64 encoded HMAC-SHA1 hash
        var encodeSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

        var simpleURL = new SimpleURL(url);
        simpleURL.addParameter('oauth_consumer_key', parameters.oauth_consumer_key);
        simpleURL.addParameter('oauth_nonce', parameters.oauth_nonce);
        simpleURL.addParameter('oauth_timestamp', parameters.oauth_timestamp);
        simpleURL.addParameter('oauth_signature_method', parameters.oauth_signature_method);
        simpleURL.addParameter('oauth_signature', encodeSignature);
        simpleURL.addParameter('oauth_version', parameters.oauth_version);
        simpleURL.addParameter('country', parameters.country);

        url = simpleURL.toString();

        return url;
    },

    _getSongs: function(artist) {
        var url = new SimpleURL('http://128.199.193.50:6081/api/v4/song/search');
        url.addParameter('api_key', ECHONEST_API_KEY)
           .addParameter('artist_id', artist.getId())
           .addParameter('sort', 'song_hotttnesss-desc')
           .addParameter('bucket', 'tracks')
           .addParameter('bucket', 'id:7digital-US')
           .addParameter('bucket', 'id:7digital-AU')
           .addParameter('bucket', 'id:7digital-UK');

        var echonestQuery = url.toString();

        return new Promise(function(resolve, reject) {
            d3.json(echonestQuery, function(error, data) {
                var errorMessage = EchoNestUtil.validateResponse(data);
                if(errorMessage) {
                    reject(errorMessage);
                }else{
                    var songs = data.response.songs
                                    .map(this._getSong.bind(this, artist));
                    resolve(songs);
                }
            }.bind(this));
        }.bind(this));
    },

    _getSong: function(artist, songJson) {
        var song = new Song(songJson.title, songJson.id, artist);

        var tracks = songJson.tracks;
        if(tracks && tracks.length > 0) {
            var track = tracks[0]; // Just take the first track
            song.setURL(track.preview_url);
            song.setAlbumCoverURL(track.release_image);
        }

        return song;
    },

    _filterSongsWithPreviewURL: function(songs) {
        return songs.filter(function(song) {
            return song.hasURL();
        });
    },

    _updateArtist: function(artist, songs) {
        artist.setSongs(songs);
    },
};

