export var tweensLibrary = {
    setKnockBackTween: function(target){
        console.log(this);
        target.knockback = this.tweens.add({
          targets: target,
          x: {
            value: () => target.x + target.knockbackDistance,
            ease: "Power1"
          },
          duration: 500,
          paused: true,
          onComplete: tweensLibrary.setKnockBackTween(target)
        });
    },
}