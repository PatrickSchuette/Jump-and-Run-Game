class BottleStatus extends StatusBar {
    IMAGES = [
        './img/statusbar/bottle/0.png',
        './img/statusbar/bottle/20.png',
        './img/statusbar/bottle/40.png',
        './img/statusbar/bottle/60.png',
        './img/statusbar/bottle/80.png',
        './img/statusbar/bottle/100.png'
    ];
    percentage = 1;
    y = 100;

    constructor(character) {
        super(); 
        this.maxValue = character.collectableObjects.maxBottle;
        this.percentage = character.collectableObjects.bottle;
        this.loadImages(this.IMAGES); 
        this.setPercentage(this.percentage); 
        this.textSuffix = " / " + this.maxValue;
    }
}

