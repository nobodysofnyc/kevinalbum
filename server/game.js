function GameCoordinator() {
  this.games = {};
};

GameCoordinator.prototype = {
  newGame: function(game, ws) {
    var turns = game.data.turns;
    var code = game.data.code;
    this.games[code] = {
      owner: ws,
      players: [ws],
      turns: turns
    }
    return this.games[code];
  },

  joinGame: function(game, ws) {
    var code = game.data.code;
    var game = this.games[code];
    if (game !== undefined) {
      game.players.push(ws);
      return game;
    } else {
      console.log("attempting to join a game that doesn't exist");
    }
  }
};

exports.coordinator = new GameCoordinator();
