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
    var moving = false;
    if (player.id !== state.id) {
      var thisOne = state.otherPlayers.getChildren().find(function(element) {
        return element.id === player.id;
      });
      if (typeof thisOne !== "undefined") {
        if (thisOne.x !== player.x || thisOne.y !== player.y) {
          thisOne.setPosition(player.x, player.y);
          moving = true;
        }

        if (player.attacking) {
          thisOne.setAnimation("slash");
          thisOne.attacking = true;
        } else if (player.blocking) {
          thisOne.setAnimation("block");
          thisOne.blocking = true;
        } else if (moving) {
          thisOne.attacking = false;
          thisOne.blocking = false;
          thisOne.setAnimation("walk");
        } else {
          thisOne.attacking = false;
          thisOne.blocking = false;
          thisOne.setAnimation("idle");
        }
      }
    }
  });

  socket.on("attack", function(player) {});
};
