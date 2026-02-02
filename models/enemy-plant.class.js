class enemyPlant extends enemy {
    y = 310;

    height = 180;
    width = 200;

    offset = {
        top: 25,
        bottom: 30,
        left: 10,
        right: 10
    }
    baseOffsetRight = 10;
    expandAttackOffsetRight = 10;

    hitPosition = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }

    hitEnergy = 10;
    otherDirection = true;


    IMAGES_WALKING = [
        './img/enemy/Plant/trap_plant.png',
        './img/enemy/Plant/trap_plant2.png',
        './img/enemy/Plant/trap_plant3.png',
        './img/enemy/Plant/trap_plant4.png',
        './img/enemy/Plant/trap_plant5.png',
        './img/enemy/Plant/trap_plant6.png'
    ];

    IMAGES_DEAD = [
        './img/enemy/Plant/trap_plant.png',
        './img/enemy/Plant/trap_plant2.png',
        './img/enemy/Plant/trap_plant3.png',
        './img/enemy/Plant/trap_plant4.png',
        './img/enemy/Plant/trap_plant5.png',
        './img/enemy/Plant/trap_plant6.png'
    ];

    
    IMAGES_ATTAC = [
        './img/enemy/Plant/trap_plant.png',
        './img/enemy/Plant/trap_plant2.png',
        './img/enemy/Plant/trap_plant3.png',
        './img/enemy/Plant/trap_plant4.png',
        './img/enemy/Plant/trap_plant5.png',
        './img/enemy/Plant/trap_plant6.png'
    ];

    /**
     * Creates a new plant enemy at the given X position.
     * Loads all animation frames and starts movement + animation loops.
     * @param {number} x - Initial X position of the plant enemy.
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = x;//   this.x = 450 + Math.random() * x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.speed = 0;
        this.animate();
    }

}