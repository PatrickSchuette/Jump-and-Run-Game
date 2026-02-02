class CharacterRogue extends Character {
    expandFightOffset = 60;

    IMAGES_WALKING = [
        './img/character/Rogue/Walk/walk1.png',
        './img/character/Rogue/Walk/walk2.png',
        './img/character/Rogue/Walk/walk3.png',
        './img/character/Rogue/Walk/walk4.png',
        './img/character/Rogue/Walk/walk5.png',
        './img/character/Rogue/Walk/walk6.png'
    ];

    IMAGES_JUMPING = [
        './img/character/Rogue/Jump/jump1.png',
        './img/character/Rogue/Jump/jump2.png',
        './img/character/Rogue/Jump/jump3.png',
        './img/character/Rogue/Jump/jump4.png',
        './img/character/Rogue/Jump/jump5.png',
        './img/character/Rogue/Jump/jump6.png',
        './img/character/Rogue/Jump/jump7.png',
    ];

    IMAGES_IDLE = [
        './img/character/Rogue/Idle/idle1.png',
        './img/character/Rogue/Idle/idle2.png',
        './img/character/Rogue/Idle/idle3.png',
        './img/character/Rogue/Idle/idle4.png',
        './img/character/Rogue/Idle/idle5.png',
        './img/character/Rogue/Idle/idle6.png',
        './img/character/Rogue/Idle/idle7.png',
        './img/character/Rogue/Idle/idle8.png',
        './img/character/Rogue/Idle/idle9.png',
        './img/character/Rogue/Idle/idle10.png',
        './img/character/Rogue/Idle/idle11.png',
        './img/character/Rogue/Idle/idle12.png'
    ];

    IMAGES_HURT = [
        './img/character/Rogue/Hurt/hurt1.png',
        './img/character/Rogue/Hurt/hurt2.png',
        './img/character/Rogue/Hurt/hurt3.png',
        './img/character/Rogue/Hurt/hurt4.png'
    ];

    IMAGES_DEAD = [
        './img/character/Rogue/Death/death1.png',
        './img/character/Rogue/Death/death2.png',
        './img/character/Rogue/Death/death3.png',
        './img/character/Rogue/Death/death4.png',
        './img/character/Rogue/Death/death5.png',
        './img/character/Rogue/Death/death6.png',
        './img/character/Rogue/Death/death7.png',
        './img/character/Rogue/Death/death8.png',
        './img/character/Rogue/Death/death9.png',
        './img/character/Rogue/Death/death10.png'
    ];

    IMAGES_ATTAC = [
        './img/character/Rogue/Attack/attack1.png',
        './img/character/Rogue/Attack/attack2.png',
        './img/character/Rogue/Attack/attack3.png',
        './img/character/Rogue/Attack/attack4.png',
    ];
    
    /**
     * Creates a new Rogue character.
     * Loads all rogue‑specific animation frames and initializes movement,
     * combat and gravity behavior.
     */
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