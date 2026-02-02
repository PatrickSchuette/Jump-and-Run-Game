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

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    energy = 5;
    baseOffsetRight = 0;
    expandAttackOffsetRight = 0;

    hasDeathPhysics = false;
    deathSpeedX = 0;
    showDrawFrame = true;
    deathFrameIndex = 0;

    IMAGES_WALKING = [];
    IMAGES_DEAD = [];

    /**
     * Base constructor for all enemy types.
     * Initializes shared enemy properties such as hitbox, energy and movement.

    * @param {number} x - Initial X position of the enemy.
    */
    constructor(x) {
        super();
    }

    /**
     * Starts the continuous movement loop for the enemy, moving it left as long as it is alive and not idle.
     */
    startMovementLoop() {
        this.moveInterval = IntervalManager.setInterval(() => {
            if (!this.dead && this.state !== 'idle') {
                this.moveLeft();
            }
        }, 1000 / 60, 'Enemy: Move', 'enemy');
    }
    
    /**
     * Starts the animation loop for the enemy, selecting the correct animation state on each tick.
     */
    startAnimationLoop() {
        this.animationInterval = IntervalManager.setInterval(() => {
            this.updateAnimationState();
        }, 100, 'Enemy: Animation', 'enemy');
    }

    /**
     * Selects the correct animation based on whether the enemy is alive or dead.
     */
    updateAnimationState() {
        if (this.dead) {
            this.playDeathAnimationOnce();
            return;
        }

        if (this.shouldAttack(80)) {
            this.startEnemyAttack();
            this.playAnimation(this.IMAGES_ATTAC);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /** starting Enemy Attack. */
    startEnemyAttack() {
        if (!this.canAttack) return;

        this.isAttacking = true;
        this.canAttack = false;
        this.expandAttackOffset();

        setTimeout(() => {
            this.isAttacking = false;
            this.expandAttackOffset();
        }, this.attackDuration);

        setTimeout(() => this.canAttack = true, this.attackCooldown);
    }
    

    /** durring attack the offset range of the object is changed */
    expandAttackOffset() {
        if (this.isAttacking) {
            this.offset.right = this.expandAttackOffsetRight;
        } else {
            this.offset.right = this.baseOffsetRight;
        }
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

    /**
     * Check if Enemy is close enought to Character to start an Attack
     * @param {integer} x distance to check if enemey is close to Character
     * @returns {boolean} true if enemy is close to character
     */
    shouldAttack(x) {
        if (!this.IMAGES_ATTAC) return false;
        return this.distanceEnemy < x;
    }

}