const express = require("express");
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "/")));

var players = [];

app.get("/initialize", function(req, res) {
  res.json(players);
});

app.get("*", function(req, res) {
  res.send("/src/index.html");
});

const port = process.env.PORT || 5000;

var server = app.listen(port, function(err) {
  if (err) throw err;
  console.log(`server running on port ${port}`);
});

var io = require("socket.io")(server);

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function(player) {
    console.log(socket.id);
    var index = players.findIndex(function(element) {
      return element.id === socket.id;
    });

    players.splice(index, 1);
    io.emit("delete player", socket.id);
    console.log("user disconnected");
  });

  socket.on("create player", function(player) {
    console.log("creating player");
    players.push(player);
    io.emit("create player", player);
  });

  socket.on("move player", function(player) {
    var index = players.findIndex(function(element) {
      return element.id === player.id;
    });
    if (typeof index !== "undefined") {
      players[index].x = player.x;
      players[index].y = player.y;

      io.emit("update", players[index]);
    }
  });
});
