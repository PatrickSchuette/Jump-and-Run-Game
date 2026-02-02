class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
     * Creates a new cloud object at a random X position.
     * Loads the cloud image and starts its drifting animation.
     */
    constructor() {
        super().loadImage('./img/world/cloud1.png');

        this.x = Math.random() * 500;
        this.animate();

    }

    /** Moves the cloud slowly to the left to simulate drifting. */
    animate() {
        this.moveLeft();

    }
}