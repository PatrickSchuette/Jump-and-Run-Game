class CollectableCoin extends MoveableObject {
    hitPosition = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }
    showDrawFrame = true;
    IMAGES = [
        './img/star/star.png',
        './img/star/star2.png',
        './img/star/star3.png',
        './img/star/star4.png',
        './img/star/star5.png',
        './img/star/star6.png',
        './img/star/star7.png',
        './img/star/star8.png',
        './img/star/star9.png',
        './img/star/star10.png',
    ]

    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.otherDirection = otherDirection;
        this.animate();
    }

    animate() {
        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100, 'CollactabeCoin: Animation', 'collectable');
    }
}