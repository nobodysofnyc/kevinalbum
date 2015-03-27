var game = new Game();
var network = new Network(function(event) {
  processWebSocketEvent(event);
});
var id = Utils.randomString(24);

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
    case Request.NEW_MULTIPLAYER_GAME_SETUP:
      game.uuid = data.game.uuid;
      console.log("game is set up")
      break;
    case Request.NEW_GAME_JOINED:
      game.turnQueue = data.game.turns.map(function(turn) { return new Turn(null, null, turn) });
      var names = game.turnQueue.map(function(turn) {
        return turn.record.name;
      })
      game.uuid = data.game.uuid;
      game.code = data.game.code;
      console.log("You've joined the game!");
      reset();
      break;
    case Request.JOINED_YOUR_GAME:
      UI.hidePlayWithFriendModal();
      console.log("Someone's joined your game");
      break;
    case Request.TURN_GUESSED:
      console.log(data);
      game.turn.opponentGuess = data.data.guess;
      console.log('Your opponent has guessed...');
      break;
    case Request.PLAYER_DISCONNECTED:
      console.log('opponent has disconnected');
      alert("Your oppenent is weaker than you and has given up");
      game.mode = GameMode.SINGLE_PLAYER;
      break;
    default:
      break;
  }
}

// clicks and things
$(document).ready(function() {
  var code = Utils.getParameterByName("code");
  if (code !== "") {
    game.mode = GameMode.MULTI_PLAYER;
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

        network.turnGuessed(val, pts);
      });
      reveal();
      $(window).bind('keypress.next', function(e) {
        if (game.mode == GameMode.SINGLE_PLAYER) {
          if (e.keyCode === 13 && game.turn.state == PlayingState.REVEAL) {
            $(window).unbind('keypress.next');
            reset();
          }
        }
      });
    }
  });

  $('#link-da-peeps').bind('click', function() {
    game.setMode(GameMode.MULTI_PLAYER, function() {
      var turns = game.turnQueue.slice();
      turns.unshift(game.turn);
      network.createNewGame({
        data: {
          code: game.code,
          turns: turns.map(function(t) { return t.asJSON(); })
        }
      });
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
