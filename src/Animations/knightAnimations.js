module.exports = {
    load(context){
        context.load.spritesheet("idling", "assets/knight/idle.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 4
          });
          context.load.spritesheet("walking", "assets/knight/walk.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 8
          });
          context.load.spritesheet("slashing", "assets/knight/slash.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 10
          });
          context.load.spritesheet("blocking", "assets/knight/block.png", {
            frameWidth: 42,
            frameHeight: 42,
            endFrame: 7
          });
    },

    create(context){
        context.anims.create({
            key: "idle",
            frames: context.anims.generateFrameNumbers("idling", { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
          });
        
          context.anims.create({
            key: "walk",
            frames: context.anims.generateFrameNumbers("walking", { start: 0, end: 7 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "slash",
            frames: context.anims.generateFrameNumbers("slashing", { start: 0, end: 9 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "block",
            frames: context.anims.generateFrameNumbers("blocking", { start: 0, end: 6 }),
            frameRate: 24
          });
    }
}