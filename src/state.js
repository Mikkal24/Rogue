// game state constructor
import { Player } from "./GameObjects/Player";
import { tweensLibrary } from "./Tweens/tweens";
import { Skeleton } from "./GameObjects/Skeleton";



export const State = function() {
  this.id = "";
  this.x = 200;
  this.y = 200;
  this.attackTimer = null;
  this.initialOtherPlayers = [];
  this.otherPlayers = {};
  this.skeletons = {};
  this.player = {};
  this.myPlayer = {};
  this.moving = false;
  this.health = 100;
  this.attack = false;
  this.block = false;
  this.disableInput = false;
  this.knockback = null;
  this.keys = {};


  this.updatePosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  this.initialize = (context, socket) => {
    console.log('initializing state')
    this.initializePlayer(context, socket);
    this.initializeOtherPlayers(context);
    this.initializeSkeletons(context);
    this.initializeKeys(context);
  }

  this.initializeKeys = (context) => {
    this.keys.W = context.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.A = context.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.S = context.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.D = context.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  this.initializePlayer = (context, socket) => {
    let knockbacktween = tweensLibrary.setKnockBackTween.bind(context);
    this.player = context.physics.add.group({
      classType: Player,
      maxSize: 1,
      collideWorldBounds: true
    });

    this.myPlayer=this.player.get();
    this.myPlayer.play("knight_idle");
    this.myPlayer.setInitialPosition(this.x, this.y, socket.id);
    knockbacktween(this.myPlayer);
    console.log("PLAYER",this.myPlayer.health);
    socket.emit("create player", {
      x: this.myPlayer.x,
      y: this.myPlayer.y,
      health: this.myPlayer.health,
      id: socket.id
    });
  };

  this.initializeOtherPlayers = context => {
    this.otherPlayers = context.physics.add.group({
      classType: Player,
      maxSize: 100,
      bounceX: 1,
      collideWorldBounds: true
    });
  }

  this.initializeSkeletons = context => {
    this.skeletons = context.physics.add.group({
      classType: Skeleton,
      maxSize: 100,
      bounceX: 1,
      collideWorldBounds: true
    })
  }
};
