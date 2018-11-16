let KnightAnimations = {};

export default KnightAnimations = {
    load(context){
        context.load.spritesheet("knight_idling", "assets/knight/idle.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 4
          });
          context.load.spritesheet("knight_walking", "assets/knight/walk.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 8
          });
          context.load.spritesheet("knight_slashing", "assets/knight/slash.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 10
          });
          context.load.spritesheet("knight_blocking", "assets/knight/block.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 7
          });
          context.load.spritesheet("knight_dieing", "assets/knight/death.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 9
          })
    },

    create(context){
        context.anims.create({
            key: "knight_idle",
            frames: context.anims.generateFrameNumbers("knight_idling", { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
          });
        
          context.anims.create({
            key: "knight_walk",
            frames: context.anims.generateFrameNumbers("knight_walking", { start: 0, end: 7 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "knight_slash",
            frames: context.anims.generateFrameNumbers("knight_slashing", { start: 0, end: 9 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "knight_block",
            frames: context.anims.generateFrameNumbers("knight_blocking", { start: 0, end: 6 }),
            frameRate: 24
          });

          context.anims.create({
            key: "knight_death",
            frames: context.anims.generateFrameNumbers("knight_dieing", {start: 0, end: 8}),
            frameRate: 24
          })
    }
}

