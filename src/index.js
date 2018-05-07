import "phaser";

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var socket = io();

var game = new Phaser.Game(config);

var x = 400;
var y = 150;
var move = 0;
var id = Date.now();
var initialOtherPlayers = [];
var otherPlayers;
var group;
var player;

function preload() {
  this.load.image("logo", "assets/logo.png");
  this.load.spritesheet("nothing", "assets/knight/idle.png", {
    frameWidth: 42,
    frameHeight: 42,
    endFrame: 4
  });
  fetch("/initialize")
    .then(function(response) {
      return response.json();
    })
    .then(function(players) {
      initialOtherPlayers = players;
    });
}

function create() {
  //   var logo = this.add.image(400, 150, "logo");
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("nothing", { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1
  });

  var OtherPlayer = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function OtherPlayer(scene) {
      Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");
    },

    setInitialPosition: function(x, y, id) {
      this.setPosition(x, y);
      this.setActive(true);
      this.setVisible(true);
      this.id = id;
    },

    setNewPosition: function(x, y) {
      this.setPosition(x, y);
    }
  });

  otherPlayers = this.add.group({
    classType: OtherPlayer,
    maxSize: 100
  });
  group = this.add.group();
  player = group.get(x, y, "nothing");
  player.play("idle");
  // group.x = x;
  // group.y = y;
  group.id = Date.now();

  // console.log(group);

  //   otherPlayers = this.add.group({ classType: OtherPlayer, defaultKey: "logo" });

  this.input.keyboard.on("keydown_W", function(event) {
    // console.log(`X: ${x} ,Y: ${y}`);
    y -= 10;
    socket.emit("move player", { x: x, y: y, id: id });
  });

  this.input.keyboard.on("keydown_A", function(event) {
    // console.log(`X: ${x} ,Y: ${y}`);
    x -= 10;
    socket.emit("move player", { x: x, y: y, id: id });
  });

  this.input.keyboard.on("keydown_S", function(event) {
    // console.log(`X: ${x} ,Y: ${y}`);
    y += 10;
    socket.emit("move player", { x: x, y: y, id: id });
  });

  this.input.keyboard.on("keydown_D", function(event) {
    // console.log(`X: ${x} ,Y: ${y}`);
    x += 10;
    socket.emit("move player", { x: x, y: y, id: id });
  });

  socket.emit("create player", { x: x, y: y, id: id });

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

  //   this.tweens.add({
  //     targets: logo,
  //     y: 450,
  //     duration: 2000,
  //     ease: "Power2",
  //     yoyo: true,
  //     loop: -1
  //   });

  //   group = this.add.group({ key: "logo", frameQuantity: 128 });

  //   this.input.on("pointermove", function(pointer) {
  //     console.log(`X: ${pointer.x} ,Y: ${pointer.y}`);
  //     x = pointer.x;
  //     y = pointer.y;
  //   });
}

function update(time, delta) {
  move += delta;
  if (move > 6) {
    // console.log("moved!");
    Phaser.Actions.ShiftPosition(group.getChildren(), x, y);
    move = 0;
  }
}

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

socket.on("delete player", function(player) {
  console.log("deleting player");
  if (player.id !== id) {
    var thisOne = otherPlayers.getChildren().find(function(element) {
      return element.id === player.id;
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

socket.on("connect", function() {
  console.log(socket.id);
});
