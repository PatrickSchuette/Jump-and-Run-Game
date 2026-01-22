class enemy extends MoveableObject {
    isAttacking = false;
    canAttack = true;
    attackDuration = 300;
    attackCooldown = 800;

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
     * Starts the movement interval for the enemy.
     * Moves left continuously while the enemy is alive.
     */
    startMovementLoop() {
        this.moveInterval = IntervalManager.setInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60, 'Enemy: Move');
    }

    /**
     * Starts the animation interval for the enemy.
     * Delegates animation selection to updateAnimationState().
     */
    startAnimationLoop() {
        this.animationInterval = IntervalManager.setInterval(() => {
            this.updateAnimationState();
        }, 100, 'Enemy: Animation');
    }

    /**
     * Selects the correct animation based on whether the enemy is alive or dead.
     */
    updateAnimationState() {
        if (this.dead) {
            this.playDeathAnimationOnce();
            return;
        }

        if (this.shouldAttack(150)) {
            this.startEnemyAttack();
            this.playAnimation(this.IMAGES_ATTAC);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    startEnemyAttack() {
        if (!this.canAttack) return;

        this.isAttacking = true;
        this.canAttack = false;

        setTimeout(() => this.isAttacking = false, this.attackDuration);
        setTimeout(() => this.canAttack = true, this.attackCooldown);
    }

    /**
     * Starts movement and animation intervals for the enemy.
     * Movement and animation logic are handled in separate loops.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
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

    shouldAttack(x) {
        if (!this.IMAGES_ATTAC) return false;
        return this.distanceEnemy < x;
    }

}