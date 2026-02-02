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

    constructor(character) {
        super();
        this.maxValue = character.collectableObjects.maxCoin;
        //this.percentage = character.collectableObjects.coin;
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
        }, 100, 'StatusBarCoin: Animation', 'statusbar');
    }

}

