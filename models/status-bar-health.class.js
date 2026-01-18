class HealthStatus extends StatusBar {
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

    constructor() {
        super(); 
        this.loadImages(this.IMAGES); 
        //this.setPercentage(this.percentage); // setzt das richtige Bild
            this.animate();
    }

    /**
     * Starts the statusbar animation by cycling through all images
     * at a fixed interval.
     */
    animate() {
        IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100, 'StatusBarHealth: Animation');
    }
}

