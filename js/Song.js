
var Song = function(name, id, artist) {
    this._name = name;
    this._id = id;
    this._artist = artist;

    this._url = null;
};

Song.prototype = {
    getName: function() {
        return this._name;
    },

    getArtist: function() {
        return this._artist;
    },

    getId: function() {
        return this._id;
    },

    setId: function(id) {
        this._id = id;
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
        return this.getName() + ' by ' + this.getArtist().getName();
    }
};

