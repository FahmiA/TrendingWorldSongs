
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

    this._playlist.onSongChange(function(songInfo) {
        this._updatePlayer(songInfo);
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

AudioPlayer.prototype._updatePlayer = function(songInfo) {
    this._titleSpan.text(songInfo.title);
    this._artistSpan.text(songInfo.artist);
    this._thumbnailDiv.style('background-image', 'url(' + songInfo.thumbnailURL + ')');

    this._enablePlayButton();
    this._enableNextButton();
    this._enablePrevButton();

    this._updateArtistURL(songInfo.artistId);
};

AudioPlayer.prototype._updateArtistURL = function(artistId) {
    var profileQuey = 'http://developer.echonest.com/api/v4/artist/profile?api_key=' + ECHONEST_API_KEY + '&format=json&id=' + artistId + '&bucket=urls';
    d3.json(profileQuey, function(error, data) {
        var status = data.response.status;
        var artistElement = d3.select('#songArtist');
        if(status.code !== 0) {
            console.log('Could not retrieve artist profile (response below).');
            console.log(data);
            artistElement.attr('href', '#');
        }else{
            var urls = data.response.artist.urls;
            if(urls.wikipedia_url) {
                artistElement.attr('href', urls.wikipedia_url);
            }else if(urls.official_url) {
                artistElement.attr('href', urls.official_url);
            }else{
                console.log('Could not retrieve artist urls (response below).');
                console.log(data);
                artistElement.attr('href', '#');
            }
        }
    });
}

