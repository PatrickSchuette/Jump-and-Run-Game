class StatusBar extends DrawableObject {
    IMAGES = [];
    maxValue;
    percentage = 100;
    textSuffix = "";
    textOffsetX = 70;
textOffsetY = 46;


    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;

        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];

        this.x = 50;
        this.width = 200;
        this.height = 60;
    }

    resolveImageIndex() {
        const maxIndex = this.IMAGES.length - 1;

        const value = this.percentage;
        const maxValue = this.maxValue ?? 100; // Default: 100%

        let index = Math.round((value / maxValue) * maxIndex);

        index = Math.max(0, Math.min(maxIndex, index));

        return index;
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

