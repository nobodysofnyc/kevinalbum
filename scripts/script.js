var game = new KevinAlbum();

function reset() {
  if (game.turn) {
    game.turn.pauseAudioPreview();
  }
  UI.cleanup();
  game.newTurn(function(album) {
    var i = album.image[album.image.length - 1];
    var src = i[Object.keys(i)[0]];
    var image = new Image();
    var load = function() {
      $('.container.active').find('.cover').not('.active').css('background-image', 'url(' + src + ')').css('opacity', '1');
    }
    image.onload = function() { load(); }
    setTimeout(function() { load(); }, 2000);

    image.src = src;
  }, function() {
    UI.reset();
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
});
