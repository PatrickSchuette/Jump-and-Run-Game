class Character extends MoveableObject {
    y = 190;
    height = 320;
    width = 200;
    speed = 10;
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
    }

    offset = {
        top: 100,
        bottom: 45,
        left: 10,
        right: 10
    }

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
 * Starts all character animation loops:
 * Uses IntervalManager to register intervals.
 */    
    animate() {
        IntervalManager.setInterval(() => {
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

            if(!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()){
                this.sndWalk.pause(); 
                this.sndWalk.currentTime = 0;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 30;
                this.playActionSound(this.sndJump);
            }

            this.world.camera_x = - this.x + 100;

        }, 1000 / 60, 'Character: Keyboard');


        IntervalManager.setInterval(() => {
            this.extandOffsetAttac();
            if (this.isDead()) {
                this.playDeathAnimationOnce();
                return;
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.ATTAC) {
                this.playAnimation(this.IMAGES_ATTAC);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 50, 'Character: Animation');

    }

    /**
     * Extand the hitframe durring attak to the range of the knight sword
     */
    extandOffsetAttac() {
        if (this.world.keyboard.ATTAC) {
            this.offset.right = -40;
        } else {
            this.offset.right = 10;
        }
    }

    /**
     * play the death sequent of character once
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