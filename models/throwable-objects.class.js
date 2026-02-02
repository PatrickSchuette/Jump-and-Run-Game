class ThrowableObject extends MoveableObject {
    showDrawFrame = true;
    hitEnergy = 20;
    distance = 450;

    IMAGES = [
        './img/Ball_animation/Bll_animation1_1.png',
        './img/Ball_animation/Bll_animation1_2.png',
        './img/Ball_animation/Bll_animation1_3.png',
        './img/Ball_animation/Bll_animation1_4.png',
        './img/Ball_animation/Bll_animation1_5.png',
        './img/Ball_animation/Bll_animation1_6.png',
        './img/Ball_animation/Bll_animation1_7.png',
        './img/Ball_animation/Bll_animation2_1.png',
        './img/Ball_animation/Bll_animation2_2.png',
        './img/Ball_animation/Bll_animation2_3.png',
        './img/Ball_animation/Bll_animation2_4.png',
        './img/Ball_animation/Bll_animation2_5.png',
        './img/Ball_animation/Bll_animation2_6.png',
        './img/Ball_animation/Bll_animation2_7.png',
    ]

    /**
     * Creates a new throwable object (bottle) at the given position.
     * Loads all animation frames, initializes size and direction,
     * and immediately starts the throw movement including animation
     * and automatic removal after reaching maximum distance.
     * @param {number} x - Initial X position where the bottle is spawned.
     * @param {number} y - Initial Y position where the bottle is spawned.
     * @param {boolean} otherDirection - Whether the bottle travels to the left.
     */
    constructor(x, y, otherDirection) {
        super();
        this.initImages();
        this.initPosition(x, y);
        this.initSize();

        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Loads the initial image and all animation frames for the throwable object.
     */
    initImages() {
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
    }

    /**
     * Sets the initial position of the throwable object.
     * @param {number} x - The starting x-coordinate.
     * @param {number} y - The starting y-coordinate.
     */
    initPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the size of the throwable object.
     */
    initSize() {
        this.height = 60;
        this.width = 50;
    }

    /**
     * Plays the animation frames for the throwable object.
     */
    updateThrowAnimation() {
        this.playAnimation(this.IMAGES);
    }

    /**
     * Moves the bottle horizontally based on its direction.
     */
    moveBottle() {
        this.x += this.otherDirection ? -10 : 10;
    }

    /**
     * Checks whether the bottle has reached its maximum travel distance.
     * @returns {boolean} True if the bottle should be removed.
     */
    hasReachedMaxDistance() {
        const traveled = Math.abs(this.x - this.startX);
        return traveled >= this.distance;
    }

    /**
     * Stops the throw interval and removes the bottle from the world.
     */
    finishThrow() {
        clearInterval(this.throwInterval);
        this.removeFromWorld();
    }

    /**
     * Initiates the bottle throw movement, including animation playback,
     * horizontal movement and automatic removal once the maximum distance
     * has been reached.
     */
    throw() {
        this.startX = this.x;

        this.throwInterval = IntervalManager.setInterval(() => {
            this.updateThrowAnimation();
            this.moveBottle();

            if (this.hasReachedMaxDistance()) {
                this.finishThrow();
            }
        }, 25, 'ThrowableObject: Throw', 'collectable');
    }

}