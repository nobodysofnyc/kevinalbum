var WebSocket = require("ws").Server;
var http = require("http");
var _ = require("underscore");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var server = http.createServer(app);

var GameCoordinator = require("./server/game").coordinator;

server.listen(port);
app.use(express.static(__dirname + "/"));

var wss = new WebSocket({ server: server });

wss.on("connection", function(ws) {
  ws.uuid = guid();
  console.log('websocket connected');

  ws.on("close", function() {
    console.log('websocket closed');
  });

  ws.on("message", function(message) {
    var data = JSON.parse(message);
    switch (data.type) {
      case "new_multiplayer_game":
        var game = GameCoordinator.newGame(data, ws);
        game.uuid = guid();
        ws.send(JSON.stringify({
          type: "new_multiplayer_game_began",
          game: {
            uuid: game.uuid
          }
        }));
        break;
      case "join_multiplayer_game":
        var game = GameCoordinator.joinGame(data, ws);
        if (game) {
          ws.send(JSON.stringify({
            type: "new_game_joined",
            game: {
              turns: game.turns,
              uuid: game.uuid
            }
          }));

          game.players.not(ws).send(JSON.stringify({
            type: "joined_your_game"
          }))
        }
      default:
        break;
    }
  });
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


