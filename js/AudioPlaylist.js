
var AudioPlaylist = function(audioElement) {
    this._audio = audioElement;
    this._songs = [];
    this._index = -1; // Index of song currently being played

    this._songChangedCallback = null;

    this._audio.onended = function() {
        this.nextSong();
    }.bind(this);
};

AudioPlaylist.prototype.addSong = function(title, artist, url, thumbnailURL) {
    this._songs.push({
        title: title,
        artist: artist,
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
        this._audio.src = this._songs[++this._index].url;
        this.play();
    }else{
        // Loop to beginning
        this._index = 0;
        this.pause();
        this._audio.src = this._songs[this._index].url;
        this.play();
    }

    if(this._songChangedCallback)
        this._songChangedCallback(this._songs[this._index]);
};

AudioPlaylist.prototype.prevSong = function() {
    if(this.hasPrevSong()) {
        // Play previous song
        this.pause();
        this._audio.src = this._songs[--this._index].url;
        this.play();
    }else{
        // Loop to end
        this._index = this.size() - 1;
        this.pause();
        this._audio.src = this._songs[this._index].url;
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

