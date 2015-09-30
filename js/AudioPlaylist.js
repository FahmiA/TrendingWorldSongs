
var AudioPlaylist = function(audioElement) {
    this._audio = audioElement;

    // The currently playing song
    this._currentSong = null;

    // All artists (Artist ID to Artist object)
    this._availableArtistMap = {};

    // All artists that still have unplayed songs
    this._playableArtists = [];

    // All unplayed songs (Artist ID to array of song objects)
    this._artistSongMap = {};

    // Played songs for navigating backwards and forwards
    this._songHistory = new History();

    // Loads artist songs
    this._trackLoader = new TrackLoader();

    this._playlistLoadCallback = null;
    this._songChangedCallback = null;

    // Song ended, play nest song
    this._audio.addEventListener('ended', this.nextSong.bind(this));

    // Song could not be retrieved, play next song
    this._audio.addEventListener('error', this.nextSong.bind(this));
};

AudioPlaylist.prototype = {

    addArtist: function(artist) {
        this._availableArtistMap[artist.getId()] = artist;
        this._playableArtists.push(artist);
    },

    clear: function() {
        this.pause();
        this._currentSong = null;

        this._availableArtistMap = {};
        this._playableArtists = [];
        this._artistSongMap = {};

        this._songHistory.reset();

        /* It just so happens that clearing the playlist is AudioPlaylistLoader's way
         * of saying it's going to load a new set of songs. */
        if(this._playlistLoadCallback) {
            this._playlistLoadCallback();
        }
    },

    play: function() {
        if(this._hasCurrentSong()) {
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

        if(this._songHistory.hasNext()) {
            var song = this._songHistory.getNext();
            console.log('Playing next song in history: ' + song.toString());
            this._playSong(song);
        } else {
            var artistIndex = parseInt(Math.random() * this._playableArtists.length);
            var artist = this._playableArtists[artistIndex];

            this._loadArtistSongs(artist)
                .then(this._playArtistSong.bind(this, artistIndex))
                .catch(this._notifyError);
        }
    },

    prevSong: function() {
        if (!this._songHistory.hasPrevious()) {
            return;
        }

        this.pause();

        var song = this._songHistory.getPrevious();
        console.log('Playing previous song in history: ' + song.toString());

        this._playSong(song);
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

    _playArtistSong: function(artistIndex, artist) {
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
            // There are no more unplayed songs by the artist
            this._playableArtists.splice(artistIndex, 1);
        }

        console.log('Playing new song: ' + song.toString());
        this._playOrSkipNextSong(song);
    },

    _playOrSkipNextSong: function(song) {
        var url = song.getURL();
        if(url === undefined || url === null) {
            // Remove the song from this playlist and try again
            this.nextSong();
        }else{
            // Play song
            this._playSong(song);

            this._songHistory.add(song);
        }
    },

    _playSong: function(song) {
        this._setCurrentSong(song);
        this._audio.src = this._trackLoader.getAuthenticatedURL(song.getURL());
        this.play();

        if(this._songChangedCallback) {
            this._songChangedCallback(song);
        }
    },

    _notifyError: function(error) {
        alert('Woops! There were problems trying to load the song. ' +
              'Select another country or skip this song.');
        console.error(error);
    },

    _setCurrentSong: function(song) {
        this._currentSong = song;
    },

    _hasCurrentSong: function() {
        return !!this._currentSong;
    },

    hasSongs: function() {
        return this._playableArtists.length > 0;
    },

    onSongChange: function(callback) {
        this._songChangedCallback = callback;
    },

    onPlaylistLoad: function(callback) {
        this._playlistLoadCallback = callback;
    }
};
