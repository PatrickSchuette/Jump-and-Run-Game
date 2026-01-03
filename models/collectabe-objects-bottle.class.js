class CollectableBottle extends MoveableObject {
    hitPosition = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }
    showDrawFrame = true;

    constructor(x, y, otherDirection) {
        super();
        this.loadImage('./img/bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.height = 120;
        this.width = 120;
        this.otherDirection = otherDirection;
    }
}