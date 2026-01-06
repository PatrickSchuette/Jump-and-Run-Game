class enemyGoblin extends enemy {
    y = 310;

    height = 200;
    width = 190;

    offset = {
        top: 45,
        bottom: 55,
        left: 45,
        right: 45
    };

    hitEnergy = 5;
    otherDirection = true;


    IMAGES_WALKING = [
        './img/enemy/goblin/walk1.png',
        './img/enemy/goblin/walk2.png',
        './img/enemy/goblin/walk3.png',
        './img/enemy/goblin/walk4.png',
        './img/enemy/goblin/walk5.png',
        './img/enemy/goblin/walk6.png',
    ];

    IMAGES_DEAD = [
        './img/enemy/goblin/death1.png',
        './img/enemy/goblin/death2.png',
        './img/enemy/goblin/death3.png',
        './img/enemy/goblin/death4.png'
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