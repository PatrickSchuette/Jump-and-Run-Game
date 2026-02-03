class Endboss extends enemy {
    y = 10;
    otherDirection = true;
    height = 650;
    width = 280;

    state = null;
    hurtCooldown = false;
    energy = 100;

    hitPosition = {
        top: false,
        bottom: false,
        left: true,
        right: true
    }

    offset = {
        top: 195,
        bottom: 190,
        left: 85,
        right: 90
    };
    baseOffsetRight = 90;
    expandAttackOffsetRight = 5;

    canSpike = true;

    showDrawFrame = true;

    IMAGES_WALKING = [
        './img/enemy/boss/walk1.png',
        './img/enemy/boss/walk2.png',
        './img/enemy/boss/walk3.png',
        './img/enemy/boss/walk4.png',
        './img/enemy/boss/walk5.png',
        './img/enemy/boss/walk6.png'
    ];

    IMAGES_HURT = [
        './img/enemy/boss/hurt1.png',
        './img/enemy/boss/hurt2.png',
        './img/enemy/boss/hurt3.png',
    ]

    IMAGES_DEAD = [
        './img/enemy/boss/death1.png',
        './img/enemy/boss/death2.png',
        './img/enemy/boss/death3.png',
        './img/enemy/boss/death4.png',
        './img/enemy/boss/death5.png',
        './img/enemy/boss/death6.png',
        './img/enemy/boss/death7.png',
    ];

    IMAGES_ATTAC = [
        'img/enemy/boss/attack1.png',
        'img/enemy/boss/attack2.png',
        'img/enemy/boss/attack3.png',
        'img/enemy/boss/attack4.png',
        'img/enemy/boss/attack5.png',
    ]

    IMAGES_IDLE = [
        'img/enemy/boss/idle1.png',
        'img/enemy/boss/idle2.png',
        'img/enemy/boss/idle3.png',
    ]

    /**
     * Creates a new Endboss instance at the given x‑position.
     * Loads all animation frames and starts movement + animation loops.
     * @param {number} x - Initial horizontal position of the boss.
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = x;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /** Applies damage to the boss. If health reaches zero, 
    *  the boss enters the death state. Otherwise, the hurt animation 
    *  is played and a temporary hurt cooldown is activated. 
    * @param {number} damage - Amount of damage taken. 
    */
    hit(damage) {
        if (this.hurtCooldown || this.dead) return;

        this.energy -= damage;

        if (this.energy <= 0) {
            this.dead = true;
            return;
        }

        this.playHurt();
    }

    /**
     * Plays the hurt animation sequence and temporarily disables
     * other actions. After the animation finishes, the boss returns
     * to the idle state.
     */
    playHurt() {
        this.state = 'hurt';
        this.hurtCooldown = true;
        this.currentImage = 0;

        IntervalManager.clearInterval('Endboss:Hurt');

        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES_HURT);

            if (this.currentImage >= this.IMAGES_HURT.length) {
                IntervalManager.clearInterval('Endboss:Hurt');
                this.state = null;
                this.hurtCooldown = false;
                this.currentImage = 0;
            }
        }, 100, 'Endboss:Hurt', 'enemy');
    }

    /**
     * Selects and plays the correct animation based on the boss state:
     */
    updateAnimationState() {
        if (this.handleDeathState()) return;
        if (this.handleHurtState()) return;
        if (this.handleIdleState()) return;
        if (this.handleSpikeState()) return;
        if (this.handleMeleeState()) return;

        this.playWalking();
    }

    /**
     * Handles the boss death state. Plays the death animation
     * and stops further animation processing.
     * @returns {boolean} True if the boss is dead and the death animation was triggered.
     */
    handleDeathState() {
        if (!this.dead) return false;
        this.playDeathAnimationOnce();
        return true;
    }

    /**
     * Handles the hurt cooldown state. When active, the boss
     * cannot perform any actions until the hurt animation finishes.
     *
     * @returns {boolean} True if the boss is currently in hurt cooldown.
     */
    handleHurtState() {
        if (!this.hurtCooldown) return false;
        return true;
    }

    /**
     * Handles the idle state. Plays the idle animation and prevents
     * the boss from moving or attacking while idle.
     *
     * @returns {boolean} True if the boss is in idle state.
     */
    handleIdleState() {
        if (this.state !== 'idle') return false;
        this.playAnimation(this.IMAGES_IDLE);
        return true;
    }

    /**
     * Determines whether the boss should perform a spike attack.
     * The attack is triggered only when the player is within a
     * specific distance range and the spike cooldown allows it.
     *
     * @returns {boolean} True if a spike attack was triggered.
     */
    handleSpikeState() {
        const inRange = this.distanceEnemy < 320 && this.distanceEnemy > 180;
        if (!this.canSpike || !inRange) return false;

        this.spawnSpikeAttack();
        return true;
    }

    /**
    * Handles the melee attack state. If the player is close enough,
    * the boss performs a melee attack and plays the attack animation.
    *
    * @returns {boolean} True if a melee attack was triggered.
    */
    handleMeleeState() {
        if (!this.shouldAttack(150)) return false;

        this.startEnemyAttack();
        this.playAnimation(this.IMAGES_ATTAC);
        return true;
    }
    /**
     * Plays the walking animation for the boss. This is the default
     * animation when no other state takes priority.
     */
    playWalking() {
        this.playAnimation(this.IMAGES_WALKING);
    }


    /**
     * Starts a melee attack if the boss is allowed to attack.
     * Temporarily increases hitbox range and triggers attack cooldown.
     */
    startEnemyAttack() {
        if (!this.canAttack || this.hurtCooldown) return;

        this.isAttacking = true;
        this.canAttack = false;

        setTimeout(() => this.isAttacking = false, this.attackDuration);
        setTimeout(() => this.canAttack = true, this.attackCooldown);
    }

    /**
     * Spawns a SpikeWave projectile in front of the boss.
     * The boss enters an idle state during the attack and
     * resumes normal behavior afterward.
     */
    spawnSpikeAttack() {
        if (!this.canSpike) return;
        this.canSpike = false;
        this.state = 'idle';
        const x = this.x + (this.otherDirection ? -50 : 250);
        const groundY = 250;
        const spike = new SpikeWave(x, groundY, this.otherDirection);

        spike.parentArray = this.world.level.enemies;
        this.world.level.enemies.push(spike);

        setTimeout(() => { this.state = null; }, 1500); 
        setTimeout(() => this.canSpike = true, 7000); 
    }



}