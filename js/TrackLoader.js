
var TrackLoader = function() {
};

TrackLoader.prototype = {
    load: function(song) {
        console.log('Retrieving info for song ' + song.toString());
        if(song.hasURL()) {
            console.log('    URL cached: ' + song.getURL());
            // Retrieve the cached URL
            return Promise.resolve(song.getURL());
        }

        console.log('   Fetching URL for first time with ids: ' + JSON.stringify(song.getIds()));
        // Fetch the URL
        var urlRetrievalPromises = song.getIds().map(this._getTracks);
        return Promise.all(urlRetrievalPromises)
                .then(this._filterTracks)
                .then(this._updateSong.bind(this, song));
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

    _getTracks: function(songId) {
        var url = new SimpleURL('http://developer.echonest.com/api/v4/song/profile');
        url.addParameter('api_key', this.ECHONEST_API_KEY)
           .addParameter('id', songId)
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
                    resolve(data.response.songs[0].tracks);
                }
            });
        });
    },

    _filterTracks: function(tracks) {
        tracks = ArrayUtil.flatten(tracks);

        return Promise.resolve(tracks);
    },
    
    _updateSong: function(song, tracks) {
        console.log('        tracks found: ' + tracks.length);
        if(tracks.length > 0) {
            var track = tracks[0]; // Just take the first track
            song.setURL(track.preview_url);
            song.setAlbumCoverURL(track.release_image);

            return Promise.resolve(song.getURL());
        }

        // No song URL (don't reject, as this is reserved for actual errors)
        return Promise.resolve();
    },
};

