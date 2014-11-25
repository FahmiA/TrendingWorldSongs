
var AudioPlaylist = function(audioElement) {
    this._audio = audioElement;
    this._songs = [];
    this._index = -1; // Index of song currently being played

    this._songChangedCallback = null;

    this._audio.addEventListener('ended', function() {
        this.nextSong();
    }.bind(this));
};

AudioPlaylist.prototype.addSong = function(title, artist, artistId, url, thumbnailURL) {
    this._songs.push({
        title: title,
        artist: artist,
        artistId: artistId,
        url: url,
        thumbnailURL: thumbnailURL
    });
};

AudioPlaylist.prototype.clear = function() {
    this.pause();
    this._songs = [];
    this._index = -1;
};

AudioPlaylist.prototype.play = function() {
    if(this._index >= 0) {
        // Resume a paused song
        this._audio.play();
    }else if(this.size() > 0) {
        // Start the first song
        this.nextSong();
    }
};

AudioPlaylist.prototype.pause = function() {
    this._audio.pause();
};

AudioPlaylist.prototype.nextSong = function() {
    if(this.hasNextSong()) {
        // Play next song
        this.pause();
        this._audio.src = this.getAuthenticatedURL(this._songs[++this._index].url);
        this.play();
    }else{
        // Loop to beginning
        this._index = 0;
        this.pause();
        this._audio.src = this.getAuthenticatedURL(this._songs[this._index].url);
        this.play();
    }

    if(this._songChangedCallback)
        this._songChangedCallback(this._songs[this._index]);
};

AudioPlaylist.prototype.prevSong = function() {
    if(this.hasPrevSong()) {
        // Play previous song
        this.pause();
        this._audio.src = this.getAuthenticatedURL(this._songs[--this._index].url);
        this.play();
    }else{
        // Loop to end
        this._index = this.size() - 1;
        this.pause();
        this._audio.src = this.getAuthenticatedURL(this._songs[this._index].url);
        this.play();
    }

    if(this._songChangedCallback)
        this._songChangedCallback(this._songs[this._index]);
};

AudioPlaylist.prototype.hasNextSong = function() {
    return this._index + 1 < this.size();
};

AudioPlaylist.prototype.hasPrevSong = function() {
    return this._index > 0;
};

AudioPlaylist.prototype.size = function() {
    return this._songs.length;
};

AudioPlaylist.prototype.onSongChange = function(callback) {
    this._songChangedCallback = callback;
};

AudioPlaylist.prototype.getAuthenticatedURL = function(url) {
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
};

