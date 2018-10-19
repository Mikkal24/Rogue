// import "phaser";
// import "./socketController";
import { Player } from "./GameObjects/Player";
import  KnightAnimations  from './Animations/knightAnimations';
import { State } from "./state";
import { SocketController } from "./socketController";
import { tryHardmap } from "./Maps/tryHardMap";
import tweens from './Tweens/tweens';


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
var socketController = new SocketController(socket);


/**
 * THIS IS THE PRE-LOAD FUNCTION
 */
function preload() {
  tryHardmap.load(this);
  KnightAnimations.load(this);
}

/**
 * THIS IS THE CREATE FUNCTION
 */
function create() {

  tryHardmap.create(this);
  KnightAnimations.create(this);

  state.initialize(this, socket);
  this.physics.add.collider(state.myPlayer, this.mainLayer);
  this.physics.add.collider(state.otherPlayers, this.mainLayer);
  getInitialPlayers();
  this.cameras.main.setBounds(
    0,
    0,
    this.map.widthInPixels,
    this.map.heightInPixels
  );;
  this.cameras.main.startFollow(state.myPlayer);

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


  socketController.initialize(state);
}

/**
 * THIS IS THE UPDATE FUNCTION
 */

function update(time, delta) {
  if(state.myPlayer.health<0) return;

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

  state.myPlayer.update(socket);
}



/**
 * UTIL functions
 */

function getInitialPlayers() {
  var request = new XMLHttpRequest();
  request.open("GET", "/initialize", false);
  request.send(null);

  if (request.status === 200) {
    state.initialOtherPlayers = JSON.parse(request.response);
    for (var key in state.initialOtherPlayers) {
      if (key !== state.myPlayer.id) {
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
      player.health -= 10;
      if (otherPlayer.flipState) {
        state.myPlayer.knockbackDistance = -50;
        state.myPlayer.knockback.play();
      } else {
        state.myPlayer.knockbackDistance = 50;
        state.myPlayer.knockback.play();
      }
      player.injured = true;
      setTimeout(() => {
        player.injured = false;
      }, 1000);
    } else if (otherPlayer.attacking && player.blocking) {
    }
  }
}

