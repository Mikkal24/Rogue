// game state constructor
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

  this.updatePosition = function(x, y) {
    this.x = x;
    this.y = y;
  };

  this.initializePlayer = function() {
    this.add.group({
      classType: Player,
      maxSize: 1
    });
  };
};
