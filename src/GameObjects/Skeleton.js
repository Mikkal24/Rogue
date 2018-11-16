export const Skeleton = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize: function Skeleton(scene){
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");
        this.setActive(true);
        this.setVisible(true);  
        this.key = "skeleton_idle"
        this.setPosition(200,200)
    }

});