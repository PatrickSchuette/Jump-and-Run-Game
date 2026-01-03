class enemyDino extends enemy {
    y = 310;

    height = 220;
    width = 270;

    offset = {
        top: 150,
        bottom: 160,
        left: 220,
        right: 260
    }

    hitEnergy = 10;
    otherDirection = true;


    IMAGES_WALKING = [
        '../img/enemy/dino/walk1.png',
        '../img/enemy/dino/walk2.png',
        '../img/enemy/dino/walk3.png',
        '../img/enemy/dino/walk4.png',
    ];

        IMAGES_DEAD = [
        '../img/enemy/dino/death1.png',
        '../img/enemy/dino/death2.png',
        '../img/enemy/dino/death3.png',
        '../img/enemy/dino/death4.png'
    ];

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = 450 + Math.random() * x;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();

    }

}