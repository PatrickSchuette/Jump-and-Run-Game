class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;

    /**
     * Creates a new background object at the given X position.
     * Loads the background image and positions it at ground level.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background segment.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}