export var tweensLibrary = {
    setKnockBackTween: function(target){
        target.knockback = this.tweens.add({
          targets: target,
          x: {
            value: () => target.x + target.knockbackDistance,
            ease: "Power1"
          },
          duration: 500,
          paused: true,
          onComplete: ()=>{
            console.log('attempting to reset tween')
            console.log(target);
            target.setKnockBackTween(target);
          }
        });
    },
}