import "phaser";
// import "./socketController";
import { Player } from "./GameObjects/OtherPlayer";

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: screen.width,
  height: screen.height,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var socket = io();
var id;
socket.on("connect", function(initialData) {
  id = socket.id;
});
var x = 400;
var y = 150;
var move = 0;

var initialOtherPlayers = [];
var otherPlayers;
var player;
var myPlayer;
var isMoving = false;
var keys = {};

function preload() {
  this.load.image("logo", "assets/logo.png");
  this.load.spritesheet("nothing", "assets/knight/idle.png", {
    frameWidth: 42,
    frameHeight: 42,
    endFrame: 4
  });
  this.load.spritesheet("walking", "assets/knight/walk.png", {
    frameWidth: 42,
    frameHeight: 42,
    endFrame: 8
  });
  this.load.spritesheet("slashing", "assets/knight/slash.png", {
    frameWidth: 42,
    frameHeight: 42,
    endFrame: 10
  });
  this.load.spritesheet("blocking", "assets/knight/block.png", {
    frameWidth: 42,
    frameHeight: 42,
    endFrame: 7
  });

  // await fetch("/initialize")
  //   .then(function(response) {
  //     return response.json();
  //   })
  //   .then(function(players) {
  //     initialOtherPlayers = players;
  //   });
}

function create() {
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("nothing", { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("walking", { start: 0, end: 7 }),
    frameRate: 2,
    repeat: -1
  });

  this.anims.create({
    key: "slash",
    frames: this.anims.generateFrameNumbers("slashing", { start: 0, end: 9 }),
    frameRate: 2
  });

  this.anims.create({
    key: "block",
    frames: this.anims.generateFrameNumbers("blocking", { start: 0, end: 6 }),
    frameRate: 2
  });

  // Initialize Player
  player = this.add.group({
    classType: Player,
    maxSize: 1
  });
  myPlayer = player.get();

  if (myPlayer) {
    myPlayer.play("idle");
    myPlayer.setInitialPosition(x, y, id);
  }

  // async function fetchAsync() {
  //   let response = await fetch("/initialize");
  //   initialOtherPlayers = await response.json();
  //   initialOtherPlayers.forEach(player => {
  //     if (player.id !== id) {
  //       var otherPlayer = otherPlayers.get();
  //       if (otherPlayer) {
  //         console.log(otherPlayer);
  //         otherPlayer.anims.play("idle");
  //         otherPlayer.setInitialPosition(player.x, player.y, player.id);
  //       }
  //     }
  //   });
  // }

  // Initialize Other Players
  otherPlayers = this.add.group({
    classType: Player,
    maxSize: 100
  });

  getInitialPlayers();

  // fetchAsync();
  // console.log(initialOtherPlayers);

  keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  // socket

  socket.emit("create player", { x: x, y: y, id: id });

  socket.on("create player", function(player) {
    console.log("creating player");
    if (player.id !== id) {
      var otherPlayer = otherPlayers.get();
      if (otherPlayer) {
        console.log(otherPlayer);
        otherPlayer.anims.play("idle");
        otherPlayer.setInitialPosition(player.x, player.y, player.id);
      }
    }
  });

  socket.on("delete player", function(deletedPlayerID) {
    console.log(`deleting player: ${deletedPlayerID}`);
    if (deletedPlayerID !== id) {
      var thisOne = otherPlayers.getChildren().find(function(element) {
        return element.id === deletedPlayerID;
      });
      thisOne.destroy();
    }
  });

  socket.on("update", function(player) {
    if (player.id !== id) {
      var thisOne = otherPlayers.getChildren().find(function(element) {
        return element.id === player.id;
      });

      thisOne.setNewPosition(player.x, player.y);
    }
  });
}

function update(time, delta) {
  isMoving = false;
  if (keys.W.isDown) {
    isMoving = true;
    y -= 5;
  }
  if (keys.A.isDown) {
    isMoving = true;
    x -= 5;
  }
  if (keys.S.isDown) {
    isMoving = true;
    y += 5;
  }
  if (keys.D.isDown) {
    isMoving = true;
    x += 5;
  }

  if (isMoving) {
    myPlayer.setAnimation("walk");
  } else {
    myPlayer.setAnimation("idle");
  }

  myPlayer.setNewPosition(x, y);
  socket.emit("move player", { x: x, y: y, id: id });
  // move = 0;
}

function getInitialPlayers() {
  var request = new XMLHttpRequest();
  request.open("GET", "/initialize", false);
  request.send(null);

  if (request.status === 200) {
    initialOtherPlayers = JSON.parse(request.response);
    initialOtherPlayers.forEach(player => {
      if (player.id !== id) {
        var otherPlayer = otherPlayers.get();
        if (otherPlayer) {
          console.log(otherPlayer);
          otherPlayer.anims.play("idle");
          otherPlayer.setInitialPosition(player.x, player.y, player.id);
        }
      }
    });
  }
}
