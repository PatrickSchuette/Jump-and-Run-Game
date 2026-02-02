class enemyDino extends enemy {
    y = 310;

    height = 220;
    width = 270;

    offset = {
        top:55,
        bottom: 60,
        left: 10,
        right: 40
    }
    baseOffsetRight = 40;
    expandAttackOffsetRight = 40;

    hitEnergy = 10;
    otherDirection = true;


    IMAGES_WALKING = [
        './img/enemy/dino/walk1.png',
        './img/enemy/dino/walk2.png',
        './img/enemy/dino/walk3.png',
        './img/enemy/dino/walk4.png',
    ];

    IMAGES_DEAD = [
        './img/enemy/dino/death1.png',
        './img/enemy/dino/death2.png',
        './img/enemy/dino/death3.png',
        './img/enemy/dino/death4.png'
    ];

    IMAGES_ATTAC =[
        'img/enemy/dino/attack1.png',
        'img/enemy/dino/attack2.png',
        'img/enemy/dino/attack3.png',
        'img/enemy/dino/attack4.png',
        'img/enemy/dino/attack5.png',
    ]

    /**
     * Creates a new dinosaur enemy at the given X position.
     * Loads all animation frames and starts movement + animation loops.
     * @param {number} x - Initial X position of the dino enemy.
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = x;//   this.x = 450 + Math.random() * x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

}