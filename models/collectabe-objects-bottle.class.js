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

    animate() {
        IntervalManager.setInterval(() => {

            this.playAnimation(this.IMAGES);

        }, 100);
    }
}