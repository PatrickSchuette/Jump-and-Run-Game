class CoinStatus extends StatusBar {
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
    y = 50;
    displayAsPercent = false;
    barColor = "goldenrod";

    /**
     * Creates a new coin status bar instance for the given character.
     * Initializes the maximum coin capacity, loads animation frames,
     * sets the current coin count and starts the animated icon loop.
     * @param {Character} character - The character whose coin inventory is displayed.
     */
    constructor(character) {
        super();
        this.maxValue = character.collectableObjects.maxCoin;
        this.loadImages(this.IMAGES);
        this.setPercentage(character.collectableObjects.coin);
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
        }, 100, 'StatusBarCoin: Animation', 'ui');
    }

}

