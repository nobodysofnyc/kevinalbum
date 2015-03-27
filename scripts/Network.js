var Request = {
  NEW_MULTIPLAYER_GAME: 0,
  JOIN_MULTIPLAYER_GAME: 1,
  TURN_GUESSED: 2,
  NEW_MULTIPLAYER_GAME_SETUP: 3,
  NEW_GAME_JOINED: 4,
  JOINED_YOUR_GAME: 5,
};

function Network(onEvent) {
  var host = location.origin.replace(/^http/, 'ws');
  this.ws = new WebSocket(host);

  this.ws.onmessage = function(data) {
    onEvent(data)
  }
}

Network.prototype = {
  createNewGame: function(data) {
    this.send({
      type: Request.NEW_MULTIPLAYER_GAME,
      data: data.data
    });
  },

  joinGame: function(code) {
    if (this.ws.readyState === 0) {
      var self = this;
      this.ws.onopen = function() {
        self.send({
          type: Request.JOIN_MULTIPLAYER_GAME,
          data: {
            code: code
          }
        });
      }
    }
  },

  turnGuessed: function(guess, points) {
    this.send({
      type: Request.TURN_GUESSED,
      data: {
        guess: guess,
        points: points
      }
    });
  },

  send: function(data) {
    data = JSON.stringify(data);
    this.ws.send(data);
  }
};
