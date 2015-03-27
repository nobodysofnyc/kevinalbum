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

  setMode: function(mode, completion) {
    switch (mode) {
      case GameMode.SINGLE_PLAYER:
        break;
      case GameMode.MULTI_PLAYER:
        this._maintainTurnQueue(this.maxTurns, function() {
          if (completion) {
            completion();
          }
        });
        break;
      default:
        break;
    }
  },

  turnsLeft: function() {
    return this.maxTurns - this.turnCount;
  },

  _maintainTurnQueue: function(count, completion) {
    var done = 0;
    var max = count ? count -1 : this.QUEUE_MAX_CAPACITY;
    max = max - this.turnQueue.length;
    for (var i = 0; i < max; i++) {
      var turn = new Turn(function(art) {
        UI.preloadImage(art);
      }, function() {
        done++;
        if (done === max) {
          if (completion) {
            completion();
          }
        }
      });
      this.turnQueue.push(turn);
    }
    // for (var i = 0; i < max - this.turnQueue.length; i++) {
    //   console.log(i);
    // }
  },

  addPoints: function(points) {
    this.points += points;
  }
};
