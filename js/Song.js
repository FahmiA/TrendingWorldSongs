
var Song = function(name, artist, artistURL) {
    this._name = name;
    this._artist = artist;
    this._artistURL = artistURL;

    this._ids = [];
    this._url = null;
    this._albumCoverURL = null;
};

Song.prototype = {
    getName: function() {
        return this._name;
    },

    getArtist: function() {
        return this._artist;
    },

    getIds: function() {
        return this._ids;
    },

    addId: function(id) {
        this._ids.push(id);
    },

    hasURL: function() {
        return !!this._url;
    },

    getURL: function() {
        return this._url;
    },

    setURL: function(url) {
        this._url = url;
    },

    getArtistURL: function() {
        return this._artistURL;
    },

    hasAlbumCoverURL: function() {
        return !!this._albumCoverURL;
    },

    getAlbumCoverURL: function() {
        return this._albumCoverURL;
    },

    setAlbumCoverURL: function(albumCoverURL) {
        this._albumCoverURL = albumCoverURL;
    },

    toString: function() {
        return this.getName() + ' by ' + this.getArtist();
    }
};

