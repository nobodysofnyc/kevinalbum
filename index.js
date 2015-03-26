var WebSocket = require("ws").Server;
var http = require("http");
var _ = require("underscore");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);
