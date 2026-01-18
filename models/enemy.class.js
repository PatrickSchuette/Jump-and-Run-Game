class enemy extends MoveableObject {
    hitPosition = {
        top: true,
        bottom: false,
        left: false,
        right: false
    }

    energy = 5;

    hasDeathPhysics = false;
    deathSpeedX = 0;
    showDrawFrame = true;
    deathFrameIndex = 0;

    IMAGES_WALKING = [];
    IMAGES_DEAD = [];

    constructor(x) {
        super();

    }

    /**
     * Starts movement and animation intervals for the enemy.
     * - Moves left continuously while alive.
     * - Plays walking animation while alive.
     * - Plays death animation once when dead.
     *
     * Uses IntervalManager to register intervals.
     */
    animate() {
        this.moveInterval = IntervalManager.setInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60, 'Enemy: Move');

        this.animationInterval = IntervalManager.setInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playDeathAnimationOnce();
            }
        }, 100, 'Enemy: Animation');
    }

    /**
     * Plays the enemy's death animation frame by frame.
     * Once the last frame is reached, the enemy is removed from the world.
     */
    playDeathAnimationOnce() {
        const frames = this.IMAGES_DEAD.length;

        this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrameIndex]];

        this.deathFrameIndex++;

        if (this.deathFrameIndex >= frames) {
            this.removeFromWorld();
        }
    }
}