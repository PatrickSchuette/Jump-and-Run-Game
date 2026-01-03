class Character extends MoveableObject {
    y = -100;
    height = 650;
    width = 550;
    speed = 10;
    groundY = 10;

    IMAGES_WALKING = [];
    IMAGES_JUMPING = [];
    IMAGES_IDLE = [];
    IMAGES_HURT = [];
    IMAGES_DEAD = [];
    IMAGES_ATTAC = [];

    world;
    collectableObjects = {
        bottle: 80,
        coin: 0,
        maxBottle: 9,
        maxCoin: 6
    }

    offset = {
        top: 300,
        bottom: 200,
        left: 180,
        right: 250
    }

    showDrawFrame = true;

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

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 30;
            }

            this.world.camera_x = - this.x + 100;

        }, 1000 / 60);


        setInterval(() => {
            this.extandOffsetAttac();
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
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
        }, 50);

    }

    extandOffsetAttac() {
        if (this.world.keyboard.ATTAC) {
            this.offset.right = 180;
        } else {
            this.offset.right = 250;
        }
    }

    jump() { }
}