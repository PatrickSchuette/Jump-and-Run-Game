class CollectableCoin extends MoveableObject {
    hitPosition = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }
    showDrawFrame = true;

    constructor(x, y, otherDirection) {
        super();
        this.loadImage('./img/coin_1.png');
        this.x = x;
        this.y = y;
        this.height = 180;
        this.width = 180;
        this.otherDirection = otherDirection;
    }
}