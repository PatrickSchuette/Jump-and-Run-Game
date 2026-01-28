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
        right: 40
    };

    animationSpeed = {
        walk: 80,
        jump: 100,
        idle: 120,
        hurt: 90,
        dead: 140,
        attack: 60
    };


    hitEnergy = 15;
    throwEnergy = 20;

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
    * Handles horizontal movement and walking sound playback.
    */
    handleHorizontalMovement() {
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
    }

    /**
     * Handles jump input and applies vertical movement.
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 30;
            this.playActionSound(this.sndJump);
        }
    }

    /**
     * Handles attack input and triggers the attack sequence if allowed.
     */
    handleAttackInput() {
        if (this.world.keyboard.ATTAC && this.canAttack && !this.isAttacking) {
            this.startAttack();
        }
    }

    /**
     * Processes all player movement input including walking, jumping,
     * attacking and camera tracking. Delegates logic to smaller helper
     * functions for clarity and maintainability.
     */
    handleMovement() {
        this.handleHorizontalMovement();
        this.handleJump();
        this.handleAttackInput();

        this.world.camera_x = -this.x + 100;
    }

    /**
     * Determines the current animation state based on character conditions.
     * Returns a string key representing the animation to play.
     */
    getAnimationState() {
        if (this.isDead()) return "dead";
        if (this.isAboveGround()) return "jump";
        if (this.isAttacking) return "attack";
        if (this.isHurt()) return "hurt";
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) return "walk";
        return "idle";
    }

    /**
     * Plays the animation associated with the given state key.
     * Uses a lookup table for clean and maintainable animation routing.
     */
    playStateAnimation(state) {
        const animations = {
            dead: () => this.playAnimation(this.IMAGES_DEAD),
            jump: () => this.playAnimation(this.IMAGES_JUMPING),
            attack: () => this.playAnimation(this.IMAGES_ATTAC),
            walk: () => this.playAnimation(this.IMAGES_WALKING),
            hurt: () => this.playAnimation(this.IMAGES_HURT),
            idle: () => this.playAnimation(this.IMAGES_IDLE)
        };

        animations[state]();
    }

    /**
     * Selects and plays the appropriate animation based on the character's
     * current state using a state lookup table for clarity and maintainability.
     */
    handleAnimation() {
        this.extandOffsetAttac();

        const state = this.getAnimationState();
        const speed = this.animationSpeed[state];

        if (state === "dead") { this.handleDeathAnimation(); return; }

        const now = performance.now();
        if (!this.lastAnimTime) this.lastAnimTime = 0;

        if (now - this.lastAnimTime >= speed) {
            this.playStateAnimation(state);
            this.lastAnimTime = now;
        }
    }


    /**
     * Extends the hitbox during attack to match sword reach.
     */
    extandOffsetAttac() {
        this.offset.right = this.isAttacking ? -40 : 50;
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
    handleDeathAnimation() {
        if (!this.isDeathSequenceRunning) {
            this.isDeathSequenceRunning = true;
            this.currentImage = 0;
            const totalDuration = this.IMAGES_DEAD.length * this.animationSpeed.dead;
            setTimeout(() => { this.world.setLevel(lost()); }, totalDuration + 200);
        }

        const now = performance.now();
        if (!this.lastDeathAnimTime) this.lastDeathAnimTime = 0;

        if (now - this.lastDeathAnimTime >= this.animationSpeed.dead) {
            this.playAnimation(this.IMAGES_DEAD);
            this.lastDeathAnimTime = now;
        }
    }
}
