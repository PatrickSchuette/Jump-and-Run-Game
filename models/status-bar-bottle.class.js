class BottleStatus extends StatusBar {
    IMAGES = [
        './img/Ball_animation/Bll_animation2_1.png',
        './img/Ball_animation/Bll_animation2_2.png',
        './img/Ball_animation/Bll_animation2_3.png',
        './img/Ball_animation/Bll_animation2_4.png',
        './img/Ball_animation/Bll_animation2_5.png',
        './img/Ball_animation/Bll_animation2_6.png',
        './img/Ball_animation/Bll_animation2_7.png',
    ]
    percentage = 1;
    y = 100;

    constructor(character) {
        super();
        this.maxValue = character.collectableObjects.maxBottle;
        this.percentage = character.collectableObjects.bottle;
        this.loadImages(this.IMAGES);
        this.textSuffix = " / " + this.maxValue;
        this.animate();
    }

    /**
     * Starts the statusbar animation by cycling through all images
     * at a fixed interval.
     */
    animate() {
        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100, 'StatusBarBottle: Animation');
    }
}

