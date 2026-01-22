class enemySpider extends enemy {
    y = 310;

    height = 220;
    width = 270;

    offset = {
        top: 70,
        bottom: 70,
        left: 75,
        right: 60
    }

    hitEnergy = 10;
    otherDirection = true;


    IMAGES_WALKING = [
        './img/enemy/spider/walk1.png',
        './img/enemy/spider/walk2.png',
        './img/enemy/spider/walk3.png',
        './img/enemy/spider/walk4.png',
    ];

        IMAGES_DEAD = [
        './img/enemy/spider/death1.png',
        './img/enemy/spider/death2.png',
        './img/enemy/spider/death3.png',
        './img/enemy/spider/death4.png'
    ];
    
    IMAGES_ATTAC =[
        'img/enemy/spider/attack1.png',
        'img/enemy/spider/attack2.png',
        'img/enemy/spider/attack3.png',
    ]

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = 450 + Math.random() * x;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();

    }

}