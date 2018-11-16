export const Skeleton = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize: function Skeleton(scene){
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "nothing");
        this.setActive(true);
        this.setVisible(true);  
        this.key = "skeleton_idle"
        this.setPosition(200,200);
        this.speed = 50;
    },

    move: function(target){
        if(target.x > this.x){
            this.setVelocityX(50);
        } else if (target.x < this.y){
            this.setVelocityX(-50);
        }
    }

});