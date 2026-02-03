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
    displayAsPercent = false;
    barColor = "blue";

    /**
     * Creates a new bottle status bar instance for the given character.
     * Initializes the maximum bottle capacity, loads animation frames,
     * sets the current bottle count and starts the animated icon loop.
     * @param {Character} character - The character whose bottle inventory is displayed.
     */
    constructor(character) {
        super();
        this.maxValue = character.collectableObjects.maxBottle;
        this.loadImages(this.IMAGES);
        this.setPercentage(character.collectableObjects.bottle);
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
        }, 100, 'StatusBarBottle: Animation', 'ui');
    }
}

