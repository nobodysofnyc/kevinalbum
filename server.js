var WebSocket = require("ws").Server;
var http = require("http");
var _ = require("underscore");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var server = http.createServer(app);

var GameCoordinator = require("./server/GameCoordinator").coordinator;

server.listen(port);
app.use(express.static(__dirname + "/"));

var wss = new WebSocket({ server: server });

wss.on("connection", function(ws) {
  ws.uuid = guid();
  console.log('websocket connected');

  ws.on("close", function() {
    console.log('websocket closed');
    var results = GameCoordinator.personDisconnected(ws);
    var games = results.map(function(result) {
      return result.game
    });
    for (var i = 0; i < games.length; i++) {
       games[i].players.not(ws).ws.send(JSON.stringify({
        type: Request.PLAYER_DISCONNECTED
       }));
       GameCoordinator.removeGame(games[i]);
    }
  });

  ws.on("message", function(message) {
    var data = JSON.parse(message);
    handleSocketEvent(data, ws);
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

var Request = {
  NEW_MULTIPLAYER_GAME: 0,
  JOIN_MULTIPLAYER_GAME: 1,
  TURN_GUESSED: 2,
  NEW_MULTIPLAYER_GAME_SETUP: 3,
  NEW_GAME_JOINED: 4,
  JOINED_YOUR_GAME: 5,
  PLAYER_DISCONNECTED: 6
}

function handleSocketEvent(data, ws) {
  switch (data.type) {
    case Request.NEW_MULTIPLAYER_GAME:
      if (!GameCoordinator.findByCode(data.code)) {
        var game = GameCoordinator.newGame(data, ws);
        game.uuid = guid();
        ws.send(JSON.stringify({
          type: Request.NEW_MULTIPLAYER_GAME_SETUP,
          game: {
            uuid: game.uuid
          }
        }));
      }
      break;
    case Request.JOIN_MULTIPLAYER_GAME:
      var game = GameCoordinator.joinGame(data, ws);
      if (game) {
        ws.send(JSON.stringify({
          type: Request.NEW_GAME_JOINED,
          game: {
            turns: game.turns,
            uuid: game.uuid,
            code: game.code
          }
        }));

        game.players.not(ws).ws.send(JSON.stringify({
          type: Request.JOINED_YOUR_GAME
        }))
      }
      break;
    case Request.TURN_GUESSED:
      var game = GameCoordinator.findByCode(data.data.code);
      if (game) {
        game.players.not(ws).ws.send(JSON.stringify({
          type: Request.TURN_GUESSED,
          data: data.data
        }))
      }
      break;
    default:
      break;
  }
}


