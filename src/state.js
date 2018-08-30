// game state constructor
import { Player } from "./GameObjects/Player";
import { tweensLibrary } from "./Tweens/tweens";



export const State = function() {
  this.id = "";
  this.x = 200;
  this.y = 200;
  this.attackTimer = null;
  this.initialOtherPlayers = [];
  this.otherPlayers = {};
  this.player = {};
  this.myPlayer = {};
  this.moving = false;
  this.attack = false;
  this.block = false;
  this.disableInput = false;
  this.knockback = null;
  this.keys = {};


  this.updatePosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  this.initialize = (context) => {
    this.initializePlayer(context);
    this.initializeOtherPlayers(context);
  }

  this.initializePlayer = (context, socket) => {
    console.log(context);
    let knockbacktween = tweensLibrary.setKnockBackTween.bind(context);
    this.player = context.physics.add.group({
      classType: Player,
      maxSize: 1,
      collideWorldBounds: true
    });

    this.myPlayer=this.player.get();
    this.myPlayer.play("idle");
    this.myPlayer.setInitialPosition(this.x, this.y, socket.id);
    knockbacktween(this.myPlayer);
    socket.emit("create player", {
      x: self.x,
      y: self.y,
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
};
