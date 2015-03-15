var THRESHOLD = 0.7;
var Points = {
  ALL: 10,
  BIG: 7,
  SMALL: 3
}

function KevinAlbum() {
  this.points = 0;
  this.turnQueue = [];
  this.turn;
}

KevinAlbum.prototype = {
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
    var turn = new Turn(function(art) {
      UI.preloadImage(art);
    });
    this.turnQueue.push(turn);
  },

  addPoints: function(points) {
    this.points += points;
  }
};
