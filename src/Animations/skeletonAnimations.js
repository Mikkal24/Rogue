let SkeletonAnimations = {};

export default SkeletonAnimations = {
    load(context){
        context.load.spritesheet("skeleton_idling", "assets/skeleton/idle.png", {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 11
          });
          context.load.spritesheet("skeleton_walking", "assets/skeleton/walk.png", {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 13
          });
          context.load.spritesheet("skeleton_slashing", "assets/skeleton/attack.png", {
            frameWidth: 43,
            frameHeight: 32,
            endFrame: 18
          });
          context.load.spritesheet("skeleton_damaged", "assets/skeleton/takeDamage.png", {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 8
          });
          context.load.spritesheet("skeleton_dieing", "assets/skeleton/death.png", {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 15
          });
          context.load.spritesheet("skeleton_react", "assets/skeleton/react.png", {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 4
          });
    },

    create(context){
        context.anims.create({
            key: "skeleton_idle",
            frames: context.anims.generateFrameNumbers("skeleton_idling", { start: 0, end: 10 }),
            frameRate: 2,
            repeat: -1
          });
        
          context.anims.create({
            key: "skeleton_walk",
            frames: context.anims.generateFrameNumbers("skeleton_walking", { start: 0, end: 12 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "skeleton_slash",
            frames: context.anims.generateFrameNumbers("skeleton_slashing", { start: 0, end: 17 }),
            frameRate: 24,
            repeat: -1
          });
        
          context.anims.create({
            key: "skeleton_damaged",
            frames: context.anims.generateFrameNumbers("skeleton_damaged", { start: 0, end: 7 }),
            frameRate: 24
          });

          context.anims.create({
            key: "skeleton_death",
            frames: context.anims.generateFrameNumbers("skeleton_dieing", {start: 0, end: 14}),
            frameRate: 24
          })
    }
}

