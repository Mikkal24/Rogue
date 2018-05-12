import "phaser";
// import "./socketController";
import { Player } from "./GameObjects/OtherPlayer";
import { State } from "./state";
import { SocketListeners } from "./socketController";

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
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
  // bounds
  this.physics.world.setBounds(0, 0, 800, 600);
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
  });

  this.anims.create({
    key: "block",
    frames: this.anims.generateFrameNumbers("blocking", { start: 0, end: 6 }),
    frameRate: 24
  });

  // Initialize Player
  state.player = this.physics.add.group({
    classType: Player,
    maxSize: 1,
    collideWorldBounds: true
  });

  state.myPlayer = state.player.get();

  if (state.myPlayer) {
    state.myPlayer.play("idle");
    state.myPlayer.setInitialPosition(state.x, state.y, state.id);
  }

  // Initialize Other Players
  state.otherPlayers = this.physics.add.group({
    classType: Player,
    maxSize: 100,
    collideWorldBounds: true
  });

  // state.otherPlayers.setBounce(1).setCollideWorldBounds(true);

  getInitialPlayers();

  // key listeners
  state.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  state.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  state.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  state.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.input.on("pointerdown", pointer => {
    if (pointer.buttons === 1) {
        state.myPlayer.attacking = true;
        socket.emit("attack", {id: state.myPlayer.id});
    } else if (pointer.buttons === 2) {
      state.myPlayer.blocking = true;
      socket.emit("block", { id: state.myPlayer.id });
    }
  });

  this.input.on("pointerup", function(pointer) {
    state.myPlayer.attacking = false;
    state.myPlayer.blocking = false;
    socket.emit("block release", { id: state.myPlayer.id });
    socket.emit("attack release", { id: state.myPlayer.id });
  });

  this.physics.add.overlap(state.myPlayer, state.otherPlayers, playerCollision);

  socket.emit("create player", {
    x: state.x,
    y: state.y,
    id: state.myPlayer.id
  });
  SocketListeners(socket, state);
}

/**
 * THIS IS THE UPDATE FUNCTION
 */

function update(time, delta) {
  state.moving = false;
  // this.physics.world.collide(state.myPlayer, state.otherPlayers);
  // this.physics.world.collide(state.otherPlayers, state.otherPlayers);
  // keyboard listeners
  if (state.keys.A.isDown) {
    state.player.setVelocityX(-160);
    state.myPlayer.flip(180);
    state.moving = true;
  } else if (state.keys.D.isDown) {
    state.myPlayer.flip(0);
    state.player.setVelocityX(160);
    state.moving = true;
  } else {
    state.player.setVelocityX(0);
  }
  if (state.myPlayer.attacking) {
    state.myPlayer.setAnimation("slash");
  } else if (state.myPlayer.blocking) {
    state.myPlayer.setAnimation("block");
    // blockCollider(myPlayer);
  } else if (state.moving) {
    state.myPlayer.setAnimation("walk");
  } else {
    state.myPlayer.setAnimation("idle");
  }
  socket.emit("move player", {
    x: state.myPlayer.x,
    y: state.myPlayer.y,
    id: state.myPlayer.id
  });
}

function getInitialPlayers() {
  var request = new XMLHttpRequest();
  request.open("GET", "/initialize", false);
  request.send(null);

  if (request.status === 200) {
    state.initialOtherPlayers = JSON.parse(request.response);
    console.log(state.initialOtherPlayers);

    for (var key in state.initialOtherPlayers) {
      if (key !== state.id) {
        var otherPlayer = state.otherPlayers.get();
        if (otherPlayer) {
          console.log(otherPlayer);
          otherPlayer.anims.play("idle");
          otherPlayer.setInitialPosition(
            state.initialOtherPlayers[key].x,
            state.initialOtherPlayers[key].y,
            key
          );
        }
      }
    }
  }
}

function playerCollision(player, otherPlayer) {
  console.log(`is this player injured? ${player.injured}`);
  if(!player.injured){
    if (otherPlayer.attacking && !player.blocking) {
      player.health -= 10;
      player.injured = true;
      setTimeout(()=>{
        player.injured = false;
      }, 5000);
      console.log(player.health);
      //hit detected
    } else if (otherPlayer.attacking && player.blocking) {
      //blocked
    }
  }
}
