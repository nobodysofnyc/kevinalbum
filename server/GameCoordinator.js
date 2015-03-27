Array.prototype.not = function(ws) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].uuid !== ws.uuid) {
      return this[i];
    }
  }
}

// Player

function Player(ws) {
  this.ws = ws;
  this.uuid = ws.uuid;
  this.pts;
}

// Game

function Game(opts) {
  this.turns = opts.turns;
  this.players = opts.players;
  this.owner = opts.owner;
  this.code = opts.code;
  this.uuid;
};

// Game Coordinator

function GameCoordinator() {
  this.games = {};
};

GameCoordinator.prototype = {
  newGame: function(game, ws) {
    var turns = game.data.turns;
    var code = game.data.code;
    var game = new Game({
      owner: ws,
      players: [new Player(ws)],
      turns: turns,
      code: code
    })
    this.games[code] = game;
    return game;
  },

  joinGame: function(game, ws) {
    var code = game.data.code;
    var game = this.games[code];
    if (game !== undefined) {
      game.players.push(new Player(ws));
      return game;
    } else {
      console.log("attempting to join a game that doesn't exist");
    }
  },

  findByCode: function(code) {
    return this.games[code];
  },

  personDisconnected: function(ws) {
    var self = this;
    var results = [];
    var games = Object.keys(this.games).map(function(key) { return self.games[key]; });
    for (var i = 0; i < games.length; i++) {
      var game = games[i];
      for (var j = 0; j < game.players.length; j++) {
        var player = game.players[j];
        if (player.uuid === ws.uuid) {
          results.push({
            game: game,
            owner: game.owner.uuid == ws.uuid,
            player: player
          })
        }
      }
    }
    return results;
  },

  removeGame: function(game) {
    delete this.games[game.code];
  }
};

exports.coordinator = new GameCoordinator();
