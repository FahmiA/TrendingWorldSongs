
var AudioPlayer = function(cfg) {
    this._playButton = cfg.playButton;
    this._prevButton = cfg.prevButton;
    this._nextButton = cfg.nextButton;
    this._thumbnailDiv = cfg.thumbnailDiv;
    this._songInfoSentence = cfg.songInfoSentence;
    this._titleSpan = cfg.titleSpan;
    this._artistSpan = cfg.artistSpan;
    this._songLoadSentence = cfg.songLoadSentence;
    this._loadingSpan = cfg.loadingSpan;
    this._playlist = cfg.playlist;
};

AudioPlayer.prototype = {
    init: function() {
        this._disablePlayButton();
        this._disableNextButton();
        this._disablePrevButton();

        this._playlist.onPlaylistLoad(function() {
            this._showLoadingMessage();
        }.bind(this));

        this._playlist.onSongChange(function(song) {
            this._updatePlayer(song);
        }.bind(this));
    },

    _disablePlayButton: function() {
        this._playButton
            .classed('disabled', true)
            .on('mouseup', function(){});
    },

    _disableNextButton: function() {
        this._nextButton
            .classed('disabled', true)
            .on('mouseup', function(){});
    },

    _disablePrevButton: function() {
        this._prevButton
            .classed('disabled', true)
            .on('mouseup', function(){});
    },

    _enablePlayButton: function() {
        this._playButton.attr('id', 'pauseTrack');

        var me = this;
        this._playButton
            .classed('disabled', false)
            .on('mouseup', function(){
                var state = me._playButton.attr('id');
                if(state === 'playTrack') {
                    me._playButton.attr('id', 'pauseTrack');
                    me._playlist.play();
                }else{
                    me._playButton.attr('id', 'playTrack');
                    me._playlist.pause();
                }
            });
    },

    _enableNextButton: function() {
        var me = this;
        this._nextButton
            .classed('disabled', false)
            .on('mouseup', function(){
                me._playlist.nextSong();
            });
    },

    _enablePrevButton: function() {
        var me = this;
        this._prevButton
            .classed('disabled', false)
            .on('mouseup', function(){
                me._playlist.prevSong();
            });
    },

    _updatePlayer: function(song) {
        this._hideLoadingMessage();

        this._titleSpan.text(song.getName());
        this._artistSpan.text(song.getArtist().getName());
        this._thumbnailDiv.style('background-image', 'url(' + song.getAlbumCoverURL() + ')');

        this._enablePlayButton();
        this._enableNextButton();
        this._enablePrevButton();

        this._artistSpan.attr('href', song.getArtist().getURL());
    },

    _showLoadingMessage: function() {
        this._songInfoSentence.classed('hidden', true);
        this._songLoadSentence.classed('hidden', false);
    },

    _hideLoadingMessage: function() {
        this._songInfoSentence.classed('hidden', false);
        this._songLoadSentence.classed('hidden', true);
    }
};

