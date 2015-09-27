
var AudioPlaylist = function(audioElement) {
    this._audio = audioElement;
    //this._songs = [];
    //this._index = -1; // Index of song currently being played
    this._availableArtistMap = {}; // Artist ID to Artist object

    this._playableArtists = [];
    this._artistSongMap = {}; // Artist ID to array of song objects
    this._playedSongs = [];

    this._trackLoader = new TrackLoader();

    this._playlistLoadCallback = null;
    this._songChangedCallback = null;

    // Song ended, play nest song
    this._audio.addEventListener('ended', this.nextSong.bind(this));

    // Song could not be retrieved, play next song
    this._audio.addEventListener('error', this._skipSongAndPlayNext.bind(this));
};

AudioPlaylist.prototype = {

    addArtist: function(artist) {
        this._availableArtistMap[artist.getId()] = artist;
        this._playableArtists.push(artist);
    },

    //addSong: function(song) {
    //    this._songs.push(song);
    //},

    //shuffle: function() {
    //    d3.shuffle(this._songs);
    //},

    clear: function() {
        console.log("AudioPlaylist.clear(): Implement!");
        //this.pause();
        //this._songs.length = 0;
        //this._index = -1;

        /* It just so happens that clearing the playlist is AudioPlaylistLoader's way
         * of saying it's going to load a new set of songs. */
        //if(this._playlistLoadCallback) {
        //    this._playlistLoadCallback();
        //}
    },

    play: function() {
        if(this._audio.src.length > 0) {
            // Resume a paused song
            this._audio.play();
        } else {
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

        var artistIndex = parseInt(Math.random() * this._playableArtists.length);
        var artist = this._playableArtists[artistIndex];

        this._loadArtistSongs(artist)
            .then(this._playArtistSong.bind(this))
            .catch(this._notifyError);
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
            .catch(this._removeSongAnContinuePrev.bind(this));
    },

    _loadArtistSongs: function(artist) {
        var loadedUnplayedSongs = this._artistSongMap[artist.getId()];
        if(loadedUnplayedSongs) {
            return Promise.resolve(artist);
        }

        if(artist.hasSongsLoaded()) {
            return Promise.resolve(this._importArtistSongs(artist));
        }

        return this._trackLoader.load(artist)
            .then(this._importArtistSongs.bind(this, artist));
    },

    _importArtistSongs: function(artist) {
        this._artistSongMap[artist.getId()] = artist.getSongs();
        return artist;
    },

    _playArtistSong: function(artist) {
        var loadedUnplayedSongs = this._artistSongMap[artist.getId()];

        if(loadedUnplayedSongs.length === 0) {
            this._playableArtists.splice(artistIndex, 1);
            this.nextSong();
            return;
        }

        var songIndex = parseInt(Math.random() * loadedUnplayedSongs.length);
        var song = loadedUnplayedSongs[songIndex];
        loadedUnplayedSongs.splice(songIndex, 1);

        if(loadedUnplayedSongs.length === 0) {
            // There are not more unplayed songs by the artist
            this._playableArtists.splice(artistIndex, 1);
        }

        this._playOrSkipNextSong(song);
    },

    _playOrSkipNextSong: function(song) {
        var url = song.getURL();
        if(url === undefined || url === null) {
            // Remove the song from this playlist and try again
            this._skipSongAndPlayNext();
        }else{
            // Play song
            this._audio.src = this._trackLoader.getAuthenticatedURL(url);
            this.play();

            this._playedSongs.push(song);

            if(this._songChangedCallback) {
                this._songChangedCallback(song);
            }
        }
    },

    _skipSongAndPlayNext: function() {
        this.nextSong();
    },

    _notifyError: function(error) {
        alert('Woops! There were problems trying to load the song. ' +
              'Select another country or skip this song.');
        console.error(error);
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
        return this._playableArtists.length > 0;
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
