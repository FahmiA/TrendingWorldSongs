
var AudioPlaylist = function(audioElement) {
    this._audio = audioElement;
    this._songs = [];
    this._index = -1; // Index of song currently being played

    this._trackLoader = new TrackLoader();

    this._playlistLoadCallback = null;
    this._songChangedCallback = null;

    this._audio.addEventListener('ended', this.nextSong.bind(this));
};

AudioPlaylist.prototype = {

    addSong: function(song) {
        this._songs.push(song);
    },

    /** Take one song per artist and repeat. */
    shuffle: function() {
        // d3.shuffle(this._songs);

        var artistToSongs = {};
        this._songs.forEach(function(song) {
            var artist = song.getArtist();
            if(artistToSongs[artist]) {
                artistToSongs[artist].push(song);
            }else{
                artistToSongs[artist] = [song];
            }
        });

        var artists = Object.keys(artistToSongs);
        var maxSongs = artists.reduce(function(maxSongs, currentArtist) {
            return Math.max(maxSongs, artistToSongs[currentArtist].length);
        }, 0);

        var songsShuffle = new Array(this._songs.length);
        var insertIndex = 0;
        for(var i = 0; i < maxSongs; i++) {
            for(var j = 0; j < artists.length; j++) {
                var artistSongs = artistToSongs[artists[j]];
                if(i < artistSongs.length) {
                    songsShuffle[insertIndex++] = artistSongs[i];
                }
            }
        }

        this._songs = songsShuffle;
    },

    clear: function() {
        this.pause();
        this._songs.length = 0;
        this._index = -1;

        /* It just so happens that clearing the playlist is AudioPlaylistLoader's way
         * of saying it's going to load a new set of songs. */
        if(this._playlistLoadCallback) {
            this._playlistLoadCallback();
        }
    },

    play: function() {
        if(this._index >= 0) {
            // Resume a paused song
            this._audio.play();
        }else if(this.size() > 0) {
            // Start the first song
            this.nextSong();
        }
    },

    pause: function() {
        this._audio.pause();
    },

    nextSong: function() {
        if(!this.hasSongs()) {
            alert('No songs found for country. Please select another country or try again later.');
            return;
        }
        
        this.pause();
        if (this.hasNextSong()) {
            this._index++;
        } else {
            this._index = 0;
        }

        console.log('next song index: ' + this._index);
        this._trackLoader.load(this._songs[this._index])
            .then(this._playSongURL.bind(this))
            .fail(this._removeSongAnContinueNext.bind(this));
    },

    prevSong: function() {
        if(!this.hasSongs()) {
            alert('No songs found for country. Please select another country or try again later.');
            return;
        }
        
        this.pause();
        if (this.hasPrevSong()) {
            this._index--;
        } else {
            this._index = this.size() - 1;
        }

        console.log('previous song index: ' + this._index);
        this._trackLoader.load(this._songs[this._index])
            .then(this._playSongURL.bind(this))
            .fail(this._removeSongAnContinuePrev.bind(this));
    },

    _playSongURL: function(url) {
        this._audio.src = this._trackLoader.getAuthenticatedURL(url);
        this.play();

        if(this._songChangedCallback) {
            this._songChangedCallback(this._songs[this._index]);
        }
    },

    _removeSongAnContinueNext: function() {
        // Remove the song from this playlist and try again
        this._songs.splice(this._index--, 1);

        this.nextSong();
    },

    _removeSongAnContinuePrev: function() {
        // Remove the song from this playlist and try again
        this._songs.splice(this._index++, 1);

        this.prevSong();
    },

    hasSongs: function() {
        return this.size() > 0;
    },

    hasNextSong: function() {
        return this._index + 1 < this.size();
    },

    hasPrevSong: function() {
        return this._index > 0;
    },

    size: function() {
        return this._songs.length;
    },

    onSongChange: function(callback) {
        this._songChangedCallback = callback;
    },

    onPlaylistLoad: function(callback) {
        this._playlistLoadCallback = callback;
    }
};
