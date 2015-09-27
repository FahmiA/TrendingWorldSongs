
var Artist = function(name, id, url) {
    this._name = name;
    this._id = id;
    this._url = url;

    this._songs = [];
    this._songsLoaded = false;
};

Artist.prototype = {
    getName: function() {
        return this._name;
    },

    getId: function() {
        return this._id;
    },

    getURL: function() {
        return this._url;
    },

    getSongs: function() {
        return this._songs.slice();
    },

    setSongs: function(songs) {
        this._songs = songs.slice();
        this._songsLoaded = true;
    },

    hasSongsLoaded: function() {
        return this._songsLoaded;
    },

    toString: function() {
        return this.getName() + ' (id: ' + this.getId() + ')';
    }
};

