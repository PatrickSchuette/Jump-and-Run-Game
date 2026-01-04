class StatusBar extends DrawableObject {
    IMAGES = [];
    maxValue;
    percentage = 100;
    textSuffix = "";
    textOffsetX = 70;
    textOffsetY = 35;


    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;


        this.x = 50;
        this.width = 50;
        this.height = 50;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "left";

        const text = `${this.percentage}${this.textSuffix}`;
        ctx.fillText(text, this.x + this.textOffsetX, this.y + this.textOffsetY);

    }

}

