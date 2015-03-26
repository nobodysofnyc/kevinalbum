var GameMode = {
  SINGLE_PLAYER: 0,
  MULTI_PLAYER: 1
};

function Game() {
  this.points = 0;
  this.turnQueue = [];
  this.turn;
  this.turnCount = 0;
  this.maxTurns = 20;
  this.QUEUE_MAX_CAPACITY = 3;
  this.mode = GameMode.SINGLE_PLAYER;
}

Game.prototype = {
  newTurn: function(callback) {
    this.turnCount++;

    if (this.turnCount <= this.maxTurns) {
      if (this.turnQueue[0] !== undefined) {
        this.turn = this.turnQueue[0];
        this.turnQueue.shift();
        callback();
      } else {
        this.turn = new Turn(function(art) {
          UI.preloadImage(art);
        }, callback);
      }
      this._maintainTurnQueue();
    } else {
      callback(true);
    }
  },

  turnsLeft: function() {
    return this.maxTurns - this.turnCount;
  },

  _maintainTurnQueue: function() {
    for (var i = 0; i < this.QUEUE_MAX_CAPACITY - this.turnQueue.length; i++) {
      var turn = new Turn(function(art) {
        UI.preloadImage(art);
      });
      this.turnQueue.push(turn);
    }
  },

  addPoints: function(points) {
    this.points += points;
  }
};
