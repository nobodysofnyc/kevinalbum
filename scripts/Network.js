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
      type: "new_multiplayer_game",
      data: data.data
    });
  },

  joinGame: function(code) {
    console.log(this.ws.readyState);
    if (this.ws.readyState === 0) {
      var self = this;
      this.ws.onopen = function() {
        self.send({
          type: "join_multiplayer_game",
          data: {
            code: code
          }
        });
      }
    }
  },

  send: function(data) {
    data = JSON.stringify(data);
    this.ws.send(data);
  }
};
