var THRESHOLD = 0.7;
var Points = {
  ALL: 10,
  BIG: 7,
  SMALL: 3
}

function KevinAlbum() {
  this.points = 0;
  this.turnQueue;
  this.turn;
}

KevinAlbum.prototype = {
  newTurn: function(onAlbumReceived, callback) {
    this.turn = new Turn(onAlbumReceived, callback);
  },

  addPoints: function(points) {
    this.points += points;
  }
};
