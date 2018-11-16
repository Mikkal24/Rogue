const express = require("express");
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "/")));

var players = {};
var playerCount = 0;

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
  console.log(`connected users(${playerCount}): `);
  for(let player in players){
    console.log(players[player]);
  }

  // Player disconnects
  socket.on("disconnect", function(player) {
    delete players[socket.id];
    io.emit("delete player", socket.id);
    console.log("user disconnected");
  });

  // player connects
  socket.on("create player", function(player) {
    if (typeof player.id !== "undefined") {
      playerCount++;
      console.log("creating player " + playerCount);
      console.log(player);
      players[player.id] = {
        id: player.id,
        x: player.x,
        y: player.y,
        health: player.health,
        flipState: false,
        attacking: false,
        blocking: false
      };

      io.emit("create player", player);
    }
  });

  // move a player
  socket.on("move player", function(player) {
    if (typeof players[player.id] === "undefined") {
      players[player.id] = {
        id: player.id,
        x: player.x,
        y: player.y,
        health: player.health,
        flipState: false,
        attacking: false,
        blocking: false
      };
    }
    players[player.id].x = player.x;
    players[player.id].y = player.y;
    players[player.id].health = player.health;

    io.emit("update", players[player.id]);
  });

  // a player is attacking
  socket.on("attack", function(player) {
    players[player.id].attacking = true;

    io.emit("update", players[player.id]);
  });

  // a player is no longer attacking
  socket.on("attack release", function(player) {
    players[player.id].attacking = false;

    io.emit("update", players[player.id]);
  });

  // a player is blocking
  socket.on("block", function(player) {
    players[player.id].blocking = true;

    io.emit("update", players[player.id]);
  });

  // a player is no longer blocking
  socket.on("block release", function(player) {
    players[player.id].blocking = false;

    io.emit("update", players[player.id]);
  });

  socket.on("flip", function(player) {
    players[player.id].flipState = player.flipState;
    io.emit("update", players[player.id]);
  });
});
