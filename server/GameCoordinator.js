Array.prototype.not = function(ws) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].uuid !== ws.uuid) {
      return this[i];
    }
  }
}

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
  },

  findByUUID: function(uuid) {
    var self = this;
    var keys = Object.keys(this.games);
    var games = keys.map(function(key) { return self.games[key]; });
    return games.filter(function (game) {
      return game.uuid === uuid;
    })[0];
  }
};

exports.coordinator = new GameCoordinator();
