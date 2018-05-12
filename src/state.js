// game state constructor
export const State = function() {
  this.id = "";
  this.x = 400;
  this.y = 150;
  this.attackTimer = null;
  this.initialOtherPlayers = [];
  this.otherPlayers = {};
  this.player = {};
  this.myPlayer = {};
  this.moving = false;
  this.attack = false;
  this.block = false;
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
