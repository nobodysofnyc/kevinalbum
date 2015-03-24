function Game() {
  this.points = 0;
  this.turnQueue = [];
  this.turn;
  this.QUEUE_MAX_CAPACITY = 3;
}

Game.prototype = {
  newTurn: function(callback) {
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
