class enemy extends MoveableObject {
    hitPosition = {
        top: true,
        bottom: false,
        left: false,
        right: false
    }

    isDead = false;
    hasDeathPhysics = false;
    deathSpeedX = 0;
    showDrawFrame = true;

    deathAnimationCount = 0;
    deathAnimationMax = 30;
    deathInterval = null;

    IMAGES_WALKING = [];
    IMAGES_DEAD = [];

    constructor(x) {
        super();

    }

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.isDead) {
                this.playDeathAnimation();
            }
        }, 100);
    }

    playDeathAnimation() { // Death-Animation abspielen 
        this.playAnimation(this.IMAGES_DEAD);
        this.deathAnimationCount++;
        if (this.deathAnimationCount >= this.deathAnimationMax) {
            this.cleanupAndRemove();
        }
    }

    cleanupAndRemove() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
        this.removeFromWorld();
    }

    isAboveGround() {
        if (this.isDead) return true;
        return super.isAboveGround();
    }

}