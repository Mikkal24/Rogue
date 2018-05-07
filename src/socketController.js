var socket = io();

socket.on("connect", function() {
  id = socket.id;
});

socket.on("create player", function(player) {
  console.log("creating player");
  if (player.id !== id) {
    var otherPlayer = otherPlayers.get();
    if (otherPlayer) {
      console.log(otherPlayer);
      otherPlayer.anims.play("idle");
      otherPlayer.setInitialPosition(player.x, player.y, player.id);
    }
  }
});

socket.on("delete player", function(deletedPlayerID) {
  console.log("deleting player");
  if (deletedPlayerID !== id) {
    var thisOne = otherPlayers.getChildren().find(function(element) {
      return element.id === deletedPlayerID;
    });

    thisOne.destroy();
  }
});

socket.on("update", function(player) {
  if (player.id !== id) {
    var thisOne = otherPlayers.getChildren().find(function(element) {
      return element.id === player.id;
    });

    thisOne.setNewPosition(player.x, player.y);
  }
});
