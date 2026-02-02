class CollectableBottle extends MoveableObject {
    hitPosition = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }
    showDrawFrame = true;
    IMAGES = [
        './img/Ball_animation/Bll_animation2_1.png',
        './img/Ball_animation/Bll_animation2_2.png',
        './img/Ball_animation/Bll_animation2_3.png',
        './img/Ball_animation/Bll_animation2_4.png',
        './img/Ball_animation/Bll_animation2_5.png',
        './img/Ball_animation/Bll_animation2_6.png',
        './img/Ball_animation/Bll_animation2_7.png',
    ]

    /**
     * Creates a new bottle collectable at the given position.
     * Loads animation frames and starts the spinning animation.
     * @param {number} x - Initial X position of the bottle.
     * @param {number} y - Initial Y position of the bottle.
     * @param {boolean} otherDirection - Whether the bottle faces left.
     */
    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
        this.otherDirection = otherDirection;
            this.animate();
    }

    /** Plays the bottle's idle animation by cycling through its frames. */
    animate() {
        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100, 'CollactableBottle: Animation', 'collectable');
    }
}