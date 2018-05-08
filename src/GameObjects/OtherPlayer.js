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
  },

  setNewPosition: function(x, y) {
    this.setPosition(x, y);
  }
});
