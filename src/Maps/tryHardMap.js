export const tryHardmap = {
    create: (context) => {
        context.map = context.make.tilemap({ key: "map" });
        context.mainTileSet = context.map.addTilesetImage("blue_generic");
        context.BackgroundTileSet = context.map.addTilesetImage("blue_generic");
        context.image_backgroundTileSet = context.map.addTilesetImage("background");
        context.image_backgroundLayer = context.map.createDynamicLayer(
          "image_background",
          context.image_backgroundTileSet,
          0,
          0
        );
        context.BackgroundLayer = context.map.createDynamicLayer(
          "Background",
          context.BackgroundTileSet,
          0,
          0
        );
        context.mainLayer = context.map.createDynamicLayer("MAIN", context.mainTileSet, 0, 0);
      
        context.mainLayer.setCollisionByExclusion([-1]);
      
        // bounds
        context.physics.world.bounds.width = context.mainLayer.width;
        context.physics.world.bounds.height = context.mainLayer.height;
    }
}