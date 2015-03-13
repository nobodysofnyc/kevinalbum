var song;
var fuzz;
var audio;

// get all the stuff
LastFM.getAlbum(function(album) {
  fuzz = new FuzzySet([album.name, album.artist]);
  Spotify.getAlbum(album, function(spotifyAlbum) {
    Spotify.getSongs(spotifyAlbum, function(songs) {
      song = songs[0];songs[0].preview_url;
      audio = new Audio();
      audio.src = song.preview_url;
    });
  });
});


// ui stuff
var UI = {
  reveal: function() {
    $('#cover').animate({ 'left': '240px' });
    $('#sleeve').animate({ 'left': '-240px' });
  },
  playAudioPreview: function() {
    if (song && song.preview_url) {
      audio.play();
    } else {
      console.log('spotify no have this song');
    }
  },
  reloadPage: function() {
    document.location = document.location;
  }
}

// clicks and things
$(document).ready(function() {
  var firstClick = true;
  $('.container').bind('click', function() {
    if (!firstClick) {
      UI.reloadPage();
    } else {
      UI.reveal();
      UI.playAudioPreview();
    }
    firstClick = false;
  });
});
