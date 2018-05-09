export const SocketListeners = function(socket, state) {
  socket.on("create player", function(player) {
    console.log("creating player");
    if (player.id !== state.id) {
      var otherPlayer = state.otherPlayers.get();
      if (otherPlayer) {
        console.log(otherPlayer);
        otherPlayer.anims.play("idle");
        otherPlayer.setInitialPosition(player.x, player.y, player.id);
      }
    }
  });

  socket.on("delete player", function(deletedPlayerID) {
    console.log(`deleting player: ${deletedPlayerID}`);
    if (deletedPlayerID !== state.id) {
      var thisOne = state.otherPlayers.getChildren().find(function(element) {
        return element.id === deletedPlayerID;
      });
      thisOne.destroy();
    }
  });

  socket.on("update", function(player) {
    if (player.id !== state.id) {
      var thisOne = state.otherPlayers.getChildren().find(function(element) {
        return element.id === player.id;
      });
      if (player.x !== thisOne.x || player.y !== thisOne.y) {
        thisOne.setNewPosition(player.x, player.y);
        thisOne.setAnimation("walk");
      } else {
        thisOne.setAnimation("idle");
      }
    }
  });
};
