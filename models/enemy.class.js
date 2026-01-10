class enemy extends MoveableObject {
    hitPosition = {
        top: true,
        bottom: false,
        left: false,
        right: false
    }

    energy = 5;

    hasDeathPhysics = false;
    deathSpeedX = 0;
    showDrawFrame = true;
    deathFrameIndex = 0;

    IMAGES_WALKING = [];
    IMAGES_DEAD = [];

    constructor(x) {
        super();

    }

animate() {
    let intervalTime = !this.isDead ? 100 : 200; // Death langsamer

    // Bewegung
    this.moveInterval = IntervalManager.setInterval(() => {
        if (!this.dead) {
            this.moveLeft();
        }
    }, 1000 / 60, 'Enemy: Move');

    // Animation
    this.animationInterval = IntervalManager.setInterval(() => {
        if (!this.dead) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playDeathAnimationOnce();
        }
    }, intervalTime, 'Enemy: Animation');
}

playDeathAnimationOnce() {
    const frames = this.IMAGES_DEAD.length;

    // aktuelles Bild setzen
    this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrameIndex]];

    this.deathFrameIndex++;

    // Wenn letzter Frame erreicht → entfernen
    if (this.deathFrameIndex >= frames) {
        this.removeFromWorld();
    }
}



}