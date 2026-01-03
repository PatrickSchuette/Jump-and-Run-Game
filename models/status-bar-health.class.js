class HealthStatus extends StatusBar {
    IMAGES = [
        './img/statusbar/heart/0.png',
        './img/statusbar/heart/20.png',
        './img/statusbar/heart/40.png',
        './img/statusbar/heart/60.png',
        './img/statusbar/heart/80.png',
        './img/statusbar/heart/100.png'
    ];
    
    maxValue = 100;
    textSuffix = "%";
    percentage = 100;
    y = 10;

    constructor() {
        super(); 
        this.loadImages(this.IMAGES); 
        this.setPercentage(this.percentage); // setzt das richtige Bild
    }
}

