export const SocketController = function(socket) {
  this.socket = socket;
  this.initialize = (state) => {
    state.myPlayer.id = socket.id;
    this.socket.on("create player", function(player) {
      if (player.id !== state.myPlayer.id) {
        console.log('creating player', player.id);
        var otherPlayer = state.otherPlayers.get();
        if (otherPlayer) {
          otherPlayer.anims.play("knight_idle");
          otherPlayer.setInitialPosition(player.x, player.y, player.id);
        }
      }
    });
  
    this.socket.on("delete player", function(deletedPlayerID) {
      if (deletedPlayerID !== state.id) {
        var thisOne = state.otherPlayers.getChildren().find(function(element) {
          return element.id === deletedPlayerID;
        });
        thisOne.destroy();
      }
    });

    this.socket.on("connect", function(initialData) {
      console.log('connected')
      state.id = socket.id;
    });
  
    this.socket.on("update", function(player) {
      var moving = false;
      if (player.id !== state.myPlayer.id) {
        var thisOne = state.otherPlayers.getChildren().find(function(element) {
          return element.id === player.id;
        });
        if (typeof thisOne !== "undefined") {
          thisOne.health = player.health;
          
          if (thisOne.x !== player.x || thisOne.y !== player.y) {
            thisOne.setPosition(player.x, player.y);
            moving = true;
          }
          if(thisOne.health<=0){
            thisOne.setAnimation('knight_death');
          } else if (player.attacking) {
            thisOne.setAnimation("knight_slash");
            thisOne.attacking = true;
          } else if (player.blocking) {
            thisOne.setAnimation("knight_block");
            thisOne.blocking = true;
          } else if (moving) {
            thisOne.attacking = false;
            thisOne.blocking = false;
            thisOne.setAnimation("knight_walk");
          } else {
            thisOne.attacking = false;
            thisOne.blocking = false;
            thisOne.setAnimation("knight_idle");
          }
  
          if (thisOne.flipState !== player.flipState) {
            thisOne.flipState = player.flipState;
            thisOne.toggleFlipX();
          }
        }
      }
    });
  
    this.socket.on("attack", function(player) {});

    socket.on('disconnect', function(){
      // close everything down
      state.myPlayer = {}
    })
  }  
}

// export const SocketListeners = function(socket, state) {
  
// };
