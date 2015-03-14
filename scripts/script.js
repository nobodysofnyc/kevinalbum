var game = new KevinAlbum();
var turnQueue = [];

function reset() {
  if (game.turn) {
    game.turn.pauseAudioPreview();
  }
  UI.cleanup();
  var turn;
  if (turnQueue.length) {
    turn = turnQueue[0];
  } else {
    game.turn = new Turn(function() {
      UI.reset();
    });
  }
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
});
