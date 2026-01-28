class EndbossStatus extends StatusBar {
    IMAGES = [
        './img/Heart/heart.png',
        './img/Heart/heart2.png',
        './img/Heart/heart3.png',
        './img/Heart/heart4.png',
        './img/Heart/heart5.png',
        './img/Heart/heart6.png',
        './img/Heart/heart7.png',
        './img/Heart/heart8.png',
        './img/Heart/heart9.png',
        './img/Heart/heart10.png',
    ];

    maxValue = 100;
    textSuffix = "%";
    percentage = 100;
    y = 10;
    x = 630;

    textOffsetX = -70;
    barColor = "darkred";
    barAlignLeft = true;
    barOffsetX = 0; 
    barCanvasOffsetX = -150;

    constructor(boss) {
        super();
        this.boss = boss;

        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.animate();
    }

    /**
     * Starts the statusbar animation by cycling through all images
     * at a fixed interval.
     */
    animate() {
        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100, 'StatusBarEndboss: Animation');
    }


    draw(ctx) {
        //this.percentage = this.boss.energy;
        this.setPercentage(this.boss.energy);
        super.draw(ctx);
    }

}
