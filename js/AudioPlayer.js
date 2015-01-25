
var AudioPlayer = function(playButton, prevButton, nextButton, thumbnailDiv, titleSpan, artistSpan, playlist) {
    this._playButton = playButton;
    this._prevButton = prevButton;
    this._nextButton = nextButton;
    this._thumbnailDiv = thumbnailDiv;
    this._titleSpan = titleSpan;
    this._artistSpan = artistSpan;
    this._playlist = playlist;
};

AudioPlayer.prototype.init = function() {
    this._disablePlayButton();
    this._disableNextButton();
    this._disablePrevButton();

    this._playlist.onSongChange(function(song) {
        this._updatePlayer(song);
    }.bind(this));
};

AudioPlayer.prototype._disablePlayButton = function() {
    this._playButton
        .classed('disabled', true)
        .on('mouseup', function(){});
};

AudioPlayer.prototype._disableNextButton = function() {
    this._nextButton
        .classed('disabled', true)
        .on('mouseup', function(){});
};

AudioPlayer.prototype._disablePrevButton = function() {
    this._prevButton
        .classed('disabled', true)
        .on('mouseup', function(){});
};

AudioPlayer.prototype._enablePlayButton = function() {
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
};

AudioPlayer.prototype._enableNextButton = function() {
    var me = this;
    this._nextButton
        .classed('disabled', false)
        .on('mouseup', function(){
            me._playlist.nextSong();
        });
};

AudioPlayer.prototype._enablePrevButton = function() {
    var me = this;
    this._prevButton
        .classed('disabled', false)
        .on('mouseup', function(){
            me._playlist.prevSong();
        });
};

AudioPlayer.prototype._updatePlayer = function(song) {
    this._titleSpan.text(song.getName());
    this._artistSpan.text(song.getArtist());
    this._thumbnailDiv.style('background-image', 'url(' + song.getAlbumCoverURL() + ')');

    this._enablePlayButton();
    this._enableNextButton();
    this._enablePrevButton();

    this._artistSpan.attr('href', song.getArtistURL());
};

