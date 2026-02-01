class Endboss extends enemy {
    y = 10;
    otherDirection = true;
    height = 650;
    width = 280;

    state = 'idle';
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
    expandAttackOffsetRight = 20;

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

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = x;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.loadImages(this.IMAGES_HURT);
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();

    }  
    
    hit(damage) {
        if (this.hurtCooldown || this.dead) return;

        this.energy -= damage;

        if (this.energy <= 0) {
            this.dead = true;
            return;
        }

        this.playHurt();
    }
    
    playHurt() {
        this.state = 'hurt';
        this.hurtCooldown = true;
        this.currentImage = 0;

        IntervalManager.clearInterval('Endboss:Hurt');

        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES_HURT);

            if (this.currentImage >= this.IMAGES_HURT.length) {
                IntervalManager.clearInterval('Endboss:Hurt');
                this.state = 'idle';
                this.hurtCooldown = false;
                this.currentImage = 0;
            }
        }, 100, 'Endboss:Hurt');
    }
    
    updateAnimationState() {
        if (this.dead) {
            this.playDeathAnimationOnce();
            return;
        }

        if (this.hurtCooldown) return; // Hurt blockiert alles

        if (this.shouldAttack(150)) {
            this.startEnemyAttack();
            this.playAnimation(this.IMAGES_ATTAC);
            return;
        }

        this.playAnimation(this.IMAGES_WALKING);
    }
    
    startEnemyAttack() {
        if (!this.canAttack || this.hurtCooldown) return;

        this.isAttacking = true;
        this.canAttack = false;

        setTimeout(() => this.isAttacking = false, this.attackDuration);
        setTimeout(() => this.canAttack = true, this.attackCooldown);
    }
    
    
}