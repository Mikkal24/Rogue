import "phaser";
// import "./socketController";
import { Player } from "./GameObjects/OtherPlayer";
import { State } from "./state";
import { SocketListeners } from "./socketController";

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
var state = new State();
var socket = io();
socket.on("connect", function(initialData) {
  state.id = socket.id;
});

/**
 * THIS IS THE PRE-LOAD FUNCTION
 */
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
}

/**
 * THIS IS THE CREATE FUNCTION
 */
function create() {
  // animations
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("nothing", { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("walking", { start: 0, end: 7 }),
    frameRate: 24,
    repeat: -1
  });

  this.anims.create({
    key: "slash",
    frames: this.anims.generateFrameNumbers("slashing", { start: 0, end: 9 }),
    frameRate: 24,
    repeat: -1
  });

  this.anims.create({
    key: "block",
    frames: this.anims.generateFrameNumbers("blocking", { start: 0, end: 6 }),
    frameRate: 24
  });

  // Initialize Player
  state.player = this.add.group({
    classType: Player,
    maxSize: 1
  });

  state.myPlayer = state.player.get();

  if (state.myPlayer) {
    state.myPlayer.play("idle");
    state.myPlayer.setInitialPosition(state.x, state.y, state.id);
  }

  // Initialize Other Players
  state.otherPlayers = this.add.group({
    classType: Player,
    maxSize: 100
  });

  getInitialPlayers();

  // key listeners
  state.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  state.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  state.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  state.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.input.on("pointerdown", function(pointer) {
    console.log(pointer);
    if (pointer.buttons === 1) {
      state.attack = true;
    } else if (pointer.buttons === 2) {
      state.block = true;
    }
  });
  this.input.on("pointerup", function(pointer) {
    state.attack = false;
    state.block = false;
  });

  socket.emit("create player", { x: state.x, y: state.y, id: state.id });
  SocketListeners(socket, state);
}

/**
 * THIS IS THE UPDATE FUNCTION
 */

function update(time, delta) {
  state.moving = false;
  if (state.keys.W.isDown) {
    state.moving = true;
    state.y -= 5;
  }
  if (state.keys.A.isDown) {
    state.moving = true;
    state.x -= 5;
  }
  if (state.keys.S.isDown) {
    state.moving = true;
    state.y += 5;
  }
  if (state.keys.D.isDown) {
    state.moving = true;
    state.x += 5;
  }

  if (state.attack) {
    state.myPlayer.setAnimation("slash");
  } else if (state.block) {
    state.myPlayer.setAnimation("block");
  } else if (state.moving) {
    state.myPlayer.setAnimation("walk");
  } else {
    state.myPlayer.setAnimation("idle");
  }

  state.myPlayer.setNewPosition(state.x, state.y);
  socket.emit("move player", { x: state.x, y: state.y, id: state.id });
  // move = 0;
}

function getInitialPlayers() {
  var request = new XMLHttpRequest();
  request.open("GET", "/initialize", false);
  request.send(null);

  if (request.status === 200) {
    state.initialOtherPlayers = JSON.parse(request.response);
    state.initialOtherPlayers.forEach(player => {
      if (player.id !== state.id) {
        var otherPlayer = state.otherPlayers.get();
        if (otherPlayer) {
          console.log(otherPlayer);
          otherPlayer.anims.play("idle");
          otherPlayer.setInitialPosition(player.x, player.y, player.id);
        }
      }
    });
  }
}
