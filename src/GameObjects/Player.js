import socketController from '../socketController';
import { tweensLibrary } from '../Tweens/tweens';

export const Player = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Player(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");

    let setKnockBackTween = tweensLibrary.setKnockBackTween.bind(scene);
    this.knockback = setKnockBackTween(this);
  },

  setInitialPosition: function(x, y, id) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.id = id;
    this.key = "idle";
    this.health = 100;
    this.knockBackDistance = 50;
    this.flipState = false;
    this.attacking = false;
    this.blocking = false;
    this.moving = false;
    this.injured = false;
  },

  setNewPosition: function(x, y) {
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
    if (this.attacking) {
      this.setAnimation("slash");
    } else if (this.blocking) {
      this.setAnimation("block");
      // blockCollider(myPlayer);
    } else if (this.moving) {
      this.setAnimation("walk");
    } else {
      this.setAnimation("idle");
    }
  },

  updateServerWithPosition(socket){
    socket.emit("move player", {
      x: this.x,
      y: this.y,
      id: this.id
    });
  },

  update: function(socket) {
    this.updateAnimations();
    this.updateServerWithPosition(socket);
  }
});
