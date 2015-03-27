var game = new Game();
var network = new Network(function(event) {
  processWebSocketEvent(event);
});
var id = Utils.randomString(24);
var sessionCode = Utils.randomString(4);

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

function processWebSocketEvent(event) {
  var data = JSON.parse(event.data);
  switch (data.type) {
    case "new_game_joined":
      game.turnQueue = data.game.turns.map(function(turn) { return new Turn(null, null, turn) });
      var names = game.turnQueue.map(function(turn) {
        return turn.record.name;
      })
      console.log(names);
      reset();
      break;
    case "joined_your_game":
      break;
    default:
      break;
  }
}

// clicks and things
$(document).ready(function() {
  var code = Utils.getParameterByName("code");
  if (code !== "") {
    network.joinGame(code);
  } else {
    reset();
  }

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
    game.setMode(GameMode.MULTI_PLAYER, function() {
      network.createNewGame({
        data: {
          code: sessionCode,
          turns: game.turnQueue.map(function(t) { return t.asJSON(); })
        }
      });
      reset();
    });

    UI.showPlayWithFriendModal(function() {
      console.log('closed');
    });
  });

  // connect spotify
  $('#connect-spotify').bind('click', function() {
    Spotify.connect();
  });

});
