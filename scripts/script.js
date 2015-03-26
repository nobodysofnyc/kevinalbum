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
      UI.updateTurnCount(game.turnCount, game.maxTurns);
      UI.reset()
    }
  });
}

function reveal() {
  UI.reveal(game.turn);
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

  $('#link-da-peeps').bind('click', function() {
    UI.showPlayWithFriendModal();
  });

  // connect spotify
  $('#connect-spotify').bind('click', function() {
    Spotify.connect();
  });
});
