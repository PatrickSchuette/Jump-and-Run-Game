class Character extends MoveableObject {
    y = 190;
    height = 320;
    width = 200;
    speed = 5;
    groundY = 177.5;

    IMAGES_WALKING = [];
    IMAGES_JUMPING = [];
    IMAGES_IDLE = [];
    IMAGES_HURT = [];
    IMAGES_DEAD = [];
    IMAGES_ATTAC = [];

    sndJump = this.createSound('./audio/jump.wav');
    sndHit = this.createSound('./audio/hurt.mp3');
    sndWalk = this.createSound('./audio/walking.wav');

    world;
    collectableObjects = {
        bottle: 0,
        coin: 0,
        maxBottle: 9,
        maxCoin: 6
    };

    offset = {
        top: 100,
        bottom: 45,
        left: 10,
        right: 10
    };

    hitEnergy = 20;
    throwEnergy = 25;

    isAttacking = false;
    attackDuration = 150;
    attackCooldown = 800;
    canAttack = true;

    showDrawFrame = true;
    isDeathSequenceRunning = false;

    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts all animation loops for movement and sprite playback.
     * Delegates logic to smaller helper functions.
     */
    animate() {
        IntervalManager.setInterval(() => this.handleMovement(), 1000 / 60, 'Character: Keyboard');
        IntervalManager.setInterval(() => this.handleAnimation(), 50, 'Character: Animation');
    }

    /**
     * Handles keyboard movement, jumping, walking sound,
     * and camera tracking.
     */
    handleMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.playActionSound(this.sndWalk);
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.playActionSound(this.sndWalk);
        }

        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) {
            this.sndWalk.pause();
            this.sndWalk.currentTime = 0;
        }

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 30;
            this.playActionSound(this.sndJump);
        }

        if (this.world.keyboard.ATTAC && !this.world.keyboard.canAttack && this.canAttack && !this.isAttacking) {
            this.startAttack();
            this.world.keyboard.ATTAC_PRESSED = true;
        }

        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles sprite animation selection based on character state.
     */
    handleAnimation() {
        this.extandOffsetAttac();

        if (this.isDead()) {
            this.playDeathAnimationOnce();
            return;
        }

        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTAC);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Extends the hitbox during attack to match sword reach.
     */
    extandOffsetAttac() {
        this.offset.right = this.isAttacking ? -40 : 10;
    }

    /**
     * Initiates a melee attack action.
     * 
     * Sets the character into an attacking state, temporarily extends the hitbox
     * to match the weapon reach, triggers the attack animation, and schedules both
     * the end of the attack window and the cooldown period. While attacking, the
     * character can deal damage to enemies on collision. The attack cannot be
     * triggered again until the cooldown has finished.
     */
    startAttack() {
        this.isAttacking = true;
        this.canAttack = false;

        this.extandOffsetAttac();

        this.playAnimation(this.IMAGES_ATTAC);

        setTimeout(() => {
            this.isAttacking = false;
            this.extandOffsetAttac();
        }, this.attackDuration);

        setTimeout(() => { this.canAttack = true; }, this.attackCooldown);
    }


    /**
     * Plays the death animation once and triggers level reset.
     */
    playDeathAnimationOnce() {
        if (this.isDeathSequenceRunning) return;
        this.isDeathSequenceRunning = true;

        this.playAnimation(this.IMAGES_DEAD);

        setTimeout(() => {
            this.world.setLevel(lost());
        }, 2000);
    }
}
