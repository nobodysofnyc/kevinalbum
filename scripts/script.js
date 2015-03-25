var game = new Game();

function reset() {
  if (game.turn) {
    game.turn.pauseAudioPreview();
  }

  UI.cleanup();
  game.newTurn(function(gameOver) {
    if (gameOver) {
      console.log('game over');
    } else {
      $('#turn-count').html(game.turnCount + " of " + game.maxTurns);
      UI.reset(function () {
        $('.container.active').find('.cover').not('.active').css('background-image', 'url(' + game.turn.record.art + ')').css('opacity', '1');
      });
    }
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
          UI.addPoints(pts);
        } else {
          console.log('you lost points maybe we havent set rules for that yet');
        }
      });
      reveal();
      $(window).bind('keypress.next', function(e) {
        if (e.keyCode === 13 && game.turn.state == PlayingState.REVEAL) {
          $(window).unbind('keypress.next');
          reset();
        }
      });
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
