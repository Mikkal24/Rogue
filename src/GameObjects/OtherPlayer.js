export const Player = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Player(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");
  },

  setInitialPosition: function(x, y, id) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.id = id;
    this.key = "idle";
    this.health = 100;
    this.direction = 0;
    this.attacking = false;
    this.blocking = false;
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

  flip: function(newDirection) {
    if (newDirection !== this.direction) {
      this.direction = newDirection;
      this.toggleFlipX();
    }
  }
});
