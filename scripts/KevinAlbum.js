var THRESHOLD = 0.7;
var Points = {
  ALL: 10,
  BIG: 7,
  SMALL: 3
}

function KevinAlbum() {
  this.points = 0;
  this.turn;
}

KevinAlbum.prototype = {
  addPoints: function(points) {
    this.points += points;
  }
};
