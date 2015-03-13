var game = new KevinAlbum();

function reset() {
  UI.reset();
  if (game.turn) {
    game.turn.pauseAudioPreview();
  }
  game.turn = new Turn();
}

function reveal() {
  game.turn.state = PlayingState.REVEAL;
  game.turn.playAudioPreview();
  UI.reveal();
}

// clicks and things
$(document).ready(function() {

  reset();

  // guess submission
  $('#guess-form').bind('submit', function(e) {
    e.preventDefault();
    var val = $('#guess').val();
    if (game.turn.state == PlayingState.GUESSING) {
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
