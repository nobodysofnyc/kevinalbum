var game = new KevinAlbum();

function reset() {
  if (game.turn) {
    game.turn.pauseAudioPreview();
  }

  UI.cleanup();
  game.newTurn(function() {
    UI.reset(function () {
      $('.container.active').find('.cover').not('.active').css('background-image', 'url(' + game.turn.record.art + ')').css('opacity', '1');
    });
  });
}

function reveal() {
  UI.reveal();
  game.turn.playAudioPreview();
}

// clicks and things
$(document).ready(function() {

  reset();

  // guess submission
  $('#guess-form').bind('submit', function(e) {
    e.preventDefault();

    if (game.turn.state == PlayingState.GUESSING) {
      var val = $('#guess').val();
      game.turn.guess(val, function(pts) {
        if (pts !== null) {
          game.points += pts;
          $('#points').html(game.points + " pts");
        }
      });
      reveal();
    } else {
      reset();
    }
  });

  // connect spotify
  $('#connect-spotify').bind('click', function() {
    var url = "https://accounts.spotify.com/authorize";
    url += "?client_id=949a744dce1840bb957e8e1da976ccc9";
    url += "&response_type=code";
    url += "&scope=";
    url += "&redirect_uri=" + encodeURIComponent("http://nobodysofnyc.com/kevinalbum");
    document.location = url;
  });

});
