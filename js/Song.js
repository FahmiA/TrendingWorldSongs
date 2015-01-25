
var Song = function(name, artist) {
    this.name = name;
    this.artist = artist;

    this._ids = [];
    this._url = null;
    this._albumCoverURL = null;
};

Song.prototype = {
    getName: function() {
        return this.name;
    },

    getArtist: function() {
        return this.artist;
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

