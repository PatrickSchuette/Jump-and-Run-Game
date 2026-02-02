class StatusBar extends DrawableObject {
    IMAGES = [];
    maxValue = 100;
    percentage = 100;
    textSuffix = "";
    textOffsetX = 70;
    textOffsetY = 35;
    x = 50;
    barColor = "red";
    displayAsPercent = true;
    svgImage = null;

    barOffsetX = 60;
    barOffsetY = 10;
    barAlignLeft = false;
    barCanvasOffsetX = 0;

    textAlignLeft = false;
    iconOffsetX = 0;

    /**
     * Creates a new generic status bar instance.
     * Initializes default values, loads icon frames and generates
     * the initial SVG progress bar based on the starting percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    /**
     * Updates the current value of the bar and regenerates the SVG.
     * Ensures the value stays within valid bounds.
     * 
     * @param {number} value - New value to display.
     */
    setPercentage(value) {
        this.percentage = Math.max(0, Math.min(value, this.maxValue));
        this.width = 50;
        this.height = 50;
        this.updateSVG();
    }

    /**
     * Draws the complete status bar (icon, bar, text) onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.drawIcon(ctx);
        this.drawBar(ctx);
        this.drawText(ctx);
    }

    /**
     * Draws the animated or static icon of the status bar.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawIcon(ctx) {
        ctx.save();
        ctx.translate(this.iconOffsetX, 0);
        super.draw(ctx);
        ctx.restore();
    }

    /**
     * Draws the SVG-based progress bar at the configured position.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawBar(ctx) {
        if (this.svgImage) {
            ctx.drawImage(this.svgImage, this.x + this.barCanvasOffsetX, this.y);
        }
    }

    /**
     * Draws the numerical value or percentage text of the status bar.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawText(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = this.textAlignLeft ? "right" : "left";

        const text = this.displayAsPercent
            ? `${this.percentage}%`
            : `${this.percentage} / ${this.maxValue}`;

        ctx.fillText(text, this.x + this.textOffsetX, this.y + this.textOffsetY);
    }

    /**
     * Converts an SVG string into an Image object.
     * @param {string} svgString - SVG markup.
     * @returns {HTMLImageElement} - Image created from the SVG.
     */
    svgToImage(svgString) {
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(svgString);
        return img;
    }

    /**
     * Generates the SVG markup for the bar based on the current value.
     * @param {number} value - Current bar value.
     * @returns {string} - SVG markup.
     */
    createStatusSVG(value) {
        const maxWidth = 150;
        const barHeight = 28;
        const fillWidth = (value / this.maxValue) * maxWidth;

        const barX = this.barAlignLeft ? 0 : this.barOffsetX;

        return `
        <svg width="320" height="50" viewBox="0 0 320 50" xmlns="http://www.w3.org/2000/svg">
            <rect x="${barX}" y="${this.barOffsetY}" width="${maxWidth}" height="${barHeight}" rx="12" ry="12"
                fill="rgba(255,255,255,0.25)" />
            <rect x="${barX}" y="${this.barOffsetY}" width="${fillWidth}" height="${barHeight}" rx="12" ry="12"
                fill="${this.barColor}" />
        </svg>`;
    }

    /**
     * Regenerates the SVG progress bar image based on the current percentage.
     */
    updateSVG() {
        const svg = this.createStatusSVG(this.percentage);
        this.svgImage = this.svgToImage(svg);
    }
}
