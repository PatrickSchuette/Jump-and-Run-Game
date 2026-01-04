class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor() {
        super().loadImage('./img/world/cloud1.png');

        this.x = Math.random() * 500;
        this.animate();

    }

    animate() {
        this.moveLeft();

    }
}