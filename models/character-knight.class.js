class CharacterKnight extends Character {

    expandFightOffset = 20;
    
    IMAGES_WALKING = [
        './img/character/Knight/Walk/walk1.png',
        './img/character/Knight/Walk/walk2.png',
        './img/character/Knight/Walk/walk3.png',
        './img/character/Knight/Walk/walk4.png',
        './img/character/Knight/Walk/walk5.png',
        './img/character/Knight/Walk/walk6.png'
    ];

    IMAGES_JUMPING = [
        './img/character/Knight/Jump/jump1.png',
        './img/character/Knight/Jump/jump2.png',
        './img/character/Knight/Jump/jump3.png',
        './img/character/Knight/Jump/jump4.png',
        './img/character/Knight/Jump/jump5.png',
        './img/character/Knight/Jump/jump6.png',
        './img/character/Knight/Jump/jump7.png',
    ];

    IMAGES_IDLE = [
        './img/character/Knight/Idle/idle1.png',
        './img/character/Knight/Idle/idle2.png',
        './img/character/Knight/Idle/idle3.png',
        './img/character/Knight/Idle/idle4.png',
        './img/character/Knight/Idle/idle5.png',
        './img/character/Knight/Idle/idle6.png',
        './img/character/Knight/Idle/idle7.png',
        './img/character/Knight/Idle/idle8.png',
        './img/character/Knight/Idle/idle9.png',
        './img/character/Knight/Idle/idle10.png',
        './img/character/Knight/Idle/idle11.png',
        './img/character/Knight/Idle/idle12.png'
    ];

    IMAGES_HURT = [
        './img/character/Knight/Hurt/hurt1.png',
        './img/character/Knight/Hurt/hurt2.png',
        './img/character/Knight/Hurt/hurt3.png',
        './img/character/Knight/Hurt/hurt4.png'
    ];

    IMAGES_DEAD = [
        './img/character/Knight/Death/death1.png',
        './img/character/Knight/Death/death2.png',
        './img/character/Knight/Death/death3.png',
        './img/character/Knight/Death/death4.png',
        './img/character/Knight/Death/death5.png',
        './img/character/Knight/Death/death6.png',
        './img/character/Knight/Death/death7.png',
        './img/character/Knight/Death/death8.png',
        './img/character/Knight/Death/death9.png',
        './img/character/Knight/Death/death10.png'
    ];

    IMAGES_ATTAC = [
        './img/character/Knight/Attack/attack1.png',
        './img/character/Knight/Attack/attack2.png',
        './img/character/Knight/Attack/attack3.png',
        './img/character/Knight/Attack/attack4.png',
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