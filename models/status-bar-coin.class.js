class CoinStatus extends StatusBar {
    IMAGES = [
        './img/statusbar/coin/0.png',
        './img/statusbar/coin/20.png',
        './img/statusbar/coin/40.png',
        './img/statusbar/coin/60.png',
        './img/statusbar/coin/80.png',
        './img/statusbar/coin/100.png'
    ];
    y = 50;

    constructor(character) {
        super(); 
        this.maxValue = character.collectableObjects.maxCoin;
        this.percentage = character.collectableObjects.coin;
        this.loadImages(this.IMAGES); 
        this.setPercentage(this.percentage); 
        this.textSuffix = " / " + this.maxValue;
    }
}

