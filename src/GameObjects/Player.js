import socketController from '../socketController';
import { tweensLibrary } from '../Tweens/tweens';

export const Player = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Player(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");
    this.setActive(true);
    this.setVisible(true);
    this.key = "knight_idle";
    this.health = 100;
    this.knockBackDistance = 50;
    this.flipState = false;
    this.attacking = false;
    this.blocking = false;
    this.moving = false;
    this.injured = false;
    this.setKnockBackTween = tweensLibrary.setKnockBackTween.bind(scene);
    this.knockback = this.setKnockBackTween(this);
  },

  setInitialPosition: function(x, y, id) {
    this.setPosition(x, y);
    this.id = id;
  },

  setNewPosition: function(x, y) {
    this.id = id;
    this.setPosition(x, y);
  },

  setAnimation: function(key) {
    if (this.key !== key) {
      this.play(key);
      this.key = key;
    }
  },

  takeDamage: function(damage) {
    this.health -= damage;
  },

  flip: function(newFlipState, socket) {
    if (newFlipState !== this.flipState) {
      this.flipState = newFlipState;
      this.toggleFlipX();
      socket.emit("flip", { id: this.id, flipState: this.flipState });
    }
  },

  

  updateAnimations: function() {
    if(this.health<=0){
      this.setAnimation("knight_death");
    }
    else if(this.attacking) {
      this.setAnimation("knight_slash");
    } else if (this.blocking) {
      this.setAnimation("knight_block");
    } else if (this.moving) {
      this.setAnimation("knight_walk");
    } else {
      this.setAnimation("knight_idle");
    }
  },

  updateServerWithPosition(socket){
    socket.emit("move player", {
      x: this.x,
      y: this.y,
      health: this.health,
      id: this.id
    });
  },

  update: function(socket) {
    this.updateAnimations();
    this.updateServerWithPosition(socket);
  }
});
