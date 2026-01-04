class CharacterMage extends Character {
    IMAGES_WALKING = [
        '../img/character/Mage/Walk/walk1.png',
        '../img/character/Mage/Walk/walk2.png',
        '../img/character/Mage/Walk/walk3.png',
        '../img/character/Mage/Walk/walk4.png',
        '../img/character/Mage/Walk/walk5.png',
        '../img/character/Mage/Walk/walk6.png'
    ];

    IMAGES_JUMPING = [
        '../img/character/Mage/Jump/jump1.png',
        '../img/character/Mage/Jump/jump2.png',
        '../img/character/Mage/Jump/jump3.png',
        '../img/character/Mage/Jump/jump4.png',
        '../img/character/Mage/Jump/jump5.png',
        '../img/character/Mage/Jump/jump6.png',
        '../img/character/Mage/Jump/jump7.png',
    ];

    IMAGES_IDLE = [
        '../img/character/Mage/Idle/idle1.png',
        '../img/character/Mage/Idle/idle2.png',
        '../img/character/Mage/Idle/idle3.png',
        '../img/character/Mage/Idle/idle4.png',
        '../img/character/Mage/Idle/idle5.png',
        '../img/character/Mage/Idle/idle6.png',
        '../img/character/Mage/Idle/idle7.png',
        '../img/character/Mage/Idle/idle8.png',
        '../img/character/Mage/Idle/idle9.png',
        '../img/character/Mage/Idle/idle10.png',
        '../img/character/Mage/Idle/idle11.png',
        '../img/character/Mage/Idle/idle12.png'
    ];

    IMAGES_HURT = [
        '../img/character/Mage/Hurt/hurt1.png',
        '../img/character/Mage/Hurt/hurt2.png',
        '../img/character/Mage/Hurt/hurt3.png',
        '../img/character/Mage/Hurt/hurt4.png'
    ];

    IMAGES_DEAD = [
        '../img/character/Mage/Death/death1.png',
        '../img/character/Mage/Death/death2.png',
        '../img/character/Mage/Death/death3.png',
        '../img/character/Mage/Death/death4.png',
        '../img/character/Mage/Death/death5.png',
        '../img/character/Mage/Death/death6.png',
        '../img/character/Mage/Death/death7.png',
        '../img/character/Mage/Death/death8.png',
        '../img/character/Mage/Death/death9.png',
        '../img/character/Mage/Death/death10.png'
    ];

    IMAGES_ATTAC = [
        '../img/character/Mage/Attack/attack1.png',
        '../img/character/Mage/Attack/attack2.png',
        '../img/character/Mage/Attack/attack3.png',
        '../img/character/Mage/Attack/attack4.png',
    ];
    

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTAC);
        this.applyGravity();

        this.animate();
    }
}