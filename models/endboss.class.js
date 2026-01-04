class Endboss extends enemy {
    y = -200;
    otherDirection = true;
    height = 950;
    width = 400;

    energy=100;

    hitPosition = {
        top: false,
        bottom: false,
        left: true,
        right: true
    }

    offset = {
        top: 300,
        bottom: 300,
        left: 110,
        right: 150
    };

    showDrawFrame = true;

    IMAGES_WALKING = [
        '../img/enemy/boss/walk1.png',
        '../img/enemy/boss/walk2.png',
        '../img/enemy/boss/walk3.png',
        '../img/enemy/boss/walk4.png',
        '../img/enemy/boss/walk5.png',
        '../img/enemy/boss/walk6.png'
    ];

    /** * Creates a new Endboss instance. 
     * * @param {number} x - Initial x-position of the boss. */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = x;

        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();

    }

    /** Starts movement and animation intervals for the boss. */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);

    }

}