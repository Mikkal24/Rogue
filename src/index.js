// import "phaser";
// import "./socketController";
import { Player } from "./GameObjects/Player";
import  KnightAnimations  from './Animations/knightAnimations';
import { State } from "./state";
import { SocketListeners } from "./socketController";
import { tryHardmap } from "./Maps/tryHardMap";

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 400,
  height: 300,
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
var _this;
var socket = io();
socket.on("connect", function(initialData) {
  state.id = socket.id;
  console.log(state.id);
});

/**
 * THIS IS THE PRE-LOAD FUNCTION
 */
function preload() {
  KnightAnimations.load(this);

  // load mapthis.load.tilemapTiledJSON("test2", "assets/testmap.json");
  this.load.tilemapTiledJSON("map", "assets/map/tryhard.json");
  this.load.spritesheet("background", "assets/map/assets/background.png", {
    frameWidth: 8,
    frameHeight: 8
  });
  this.load.spritesheet("blue_generic", "assets/map/assets/blue_generic.png", {
    frameWidth: 8,
    frameHeight: 8
  });
}

/**
 * THIS IS THE CREATE FUNCTION
 */
function create() {
  _this = this;
  /** Create MAP */
  tryHardmap.create(this);

  // animations
  KnightAnimations.create(this);

  // Initialize Player
  state.initializePlayer(this, socket);

  // establish camera
  this.cameras.main.setBounds(
    0,
    0,
    this.map.widthInPixels,
    this.map.heightInPixels
  );

  // state.myPlayer = state.player.get();
  this.physics.add.collider(state.myPlayer, this.mainLayer);
  this.cameras.main.startFollow(state.myPlayer);

  if (state.myPlayer) {
    state.myPlayer.play("idle");
    state.myPlayer.setInitialPosition(state.x, state.y, socket.id);

    setKnockBackTween();
  }

  // Initialize Other Players
  state.initializeOtherPlayers(this, socket);
  this.physics.add.collider(state.otherPlayers, this.mainLayer);

  getInitialPlayers();

  // key listeners
  state.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  state.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  state.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  state.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.input.on("pointerdown", pointer => {
    if (pointer.buttons === 1) {
      state.myPlayer.attacking = true;
      socket.emit("attack", { id: state.myPlayer.id });
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


  SocketListeners(socket, state);
}

/**
 * THIS IS THE UPDATE FUNCTION
 */

function update(time, delta) {
  state.myPlayer.moving = false;

  // keyboard listeners
  if (state.keys.A.isDown) {
    state.player.setVelocityX(-160);
    state.myPlayer.flip(true, socket);
    state.myPlayer.moving = true;
  } else if (state.keys.D.isDown) {
    state.player.setVelocityX(160);
    state.myPlayer.flip(false, socket);
    state.myPlayer.moving = true;
  } else {
    state.player.setVelocityX(0);
  }
  // Jump
  if (state.keys.W.isDown && state.myPlayer.body.onFloor()) {
    state.player.setVelocityY(-250);
  }

  state.myPlayer.update();
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

    for (var key in state.initialOtherPlayers) {
      if (key !== state.id) {
        var otherPlayer = state.otherPlayers.get();
        if (otherPlayer) {
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
  if (!player.injured) {
    if (otherPlayer.attacking && !player.blocking) {
      console.log("knocback");
      player.health -= 10;
      if (otherPlayer.flipState) {
        state.myPlayer.knockbackDistance = -50;
        state.knockback.play();
        console.log("knockback");
      } else {
        state.myPlayer.knockbackDistance = 50;
        state.knockback.play();
      }
      player.injured = true;
      setTimeout(() => {
        player.injured = false;
      }, 1000);
      //hit detected
    } else if (otherPlayer.attacking && player.blocking) {
      //blocked
    }
  }
}

function setKnockBackTween(tween, targets, myImage) {
  state.knockback = _this.tweens.add({
    targets: state.myPlayer,
    x: {
      value: () => state.myPlayer.x + state.myPlayer.knockbackDistance,
      ease: "Power1"
    },
    duration: 500,
    paused: true,
    onComplete: setKnockBackTween
  });
}
