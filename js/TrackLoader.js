
var TrackLoader = function() {
};

// TODO: Don't manually create deferreds, this can be an anti-pattern: https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern
TrackLoader.prototype = {
    load: function(song) {
        var deferred = Q.defer();

        console.log('Retrieving info for song ' + song.toString());
        if(song.hasURL()) {
            console.log('    URL cached: ' + song.getURL());
            // Retrieve the cached URL
            deferred.resolve(song.getURL());
        } else {
            console.log('   Fetching URL for first time with ids: ' + JSON.stringify(song.getIds()));
            // Fetch the URL
            var urlRetrievalPromises = song.getIds().map(this._getTracks);
            var promise = Q.allSettled(urlRetrievalPromises)
                .then(this._filterTracks)
                .then(this._updateSong.bind(this, song));

            deferred.resolve(promise);
        }

        return deferred.promise;
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
            oauth_version : '1.0'
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

        var deferred = Q.defer();
        d3.json(echonestQuery, function(error, data) {
            if(!data || data.response.status.code !== 0) {
                deferred.reject('Could not retrieve song track.');
            }else{
                deferred.resolve(data.response.songs[0].tracks);
            }
        });

        return deferred.promise;
    },

    _filterTracks: function(trackResponses) {
        // Find all responses which succeeded and have tracks (some songs don't have preview tracks).
        var successResponses = trackResponses.filter(function(trackResponse) {
            return trackResponse.state === 'fulfilled' && trackResponse.value.length > 0;
        });

        // Extract just the tracks from the successful responses
        var tracks = successResponses.map(function(successResponse) {
                return successResponse.value;
            });
        tracks = ArrayUtil.flatten(tracks);

        var deferred = Q.defer();
        deferred.resolve(tracks);
        return deferred.promise;
    },
    
    _updateSong: function(song, tracks) {
        var deferred = Q.defer();

        console.log('        tracks found: ' + tracks.length);
        if(tracks.length > 0) {
            var track = tracks[0]; // Just take the first track
            song.setURL(track.preview_url);
            song.setAlbumCoverURL(track.release_image);

            deferred.resolve(song.getURL());
        }else{
            deferred.reject('No preview URL for song ' + song.getName() + ' by ' + song.getArtist() + '.');
        }

        return deferred.promise;
    },
};

