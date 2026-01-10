class ThrowableObject extends MoveableObject {
    showDrawFrame = true;
    hitEnergy = 10;
    distance = 200;

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

    constructor(x, y, otherDirection) {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        let throwDirection = this.otherDirection;
        this.startX = this.x;

        
        this.throwInterval = IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
            if (this.otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }

            const traveled = Math.abs(this.x - this.startX);
            
            if (traveled >= this.distance) {
                clearInterval(this.throwInterval);
                this.removeFromWorld();
            }
        }, 25, 'ThrowableObject: Throw');
    }
}