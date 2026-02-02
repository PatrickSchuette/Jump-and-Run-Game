/**
 * Handles the configuration menu overlay.
 */
class Configure {

    /**
     * Creates the configuration menu overlay.
     * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
     * @param {Object} keyboard - The keyboard handler instance.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.active = true;
        this.controls = this.loadControls();

        this.changeCharBtn = {
            x: this.canvas.width / 2 - 150,
            y: this.canvas.height - 120,
            width: 300,
            height: 60
        };

        /** Bind click handler so it can be removed later */
        this.boundClickHandler = this.handleClick.bind(this);
        this.canvas.addEventListener("pointerdown", this.boundClickHandler);

        this.draw();
    }

    /**
     * Returns the default control mappings.
     * @returns {Object<string,string>} A mapping of action → key.
     */
    loadControls() {
        return {
            Left: "LEFT",
            Right: "RIGHT",
            Jump: "SPACE",
            Fight: "F",
            Throw: "D"
        };
    }

    /**
     * Main draw loop for the configuration menu.
     */
    draw() {
        if (!this.active) return;

        this.drawBackground();
        this.drawTitle();
        this.drawControls();
        this.drawChangeCharacterButton();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws the dimmed background overlay.
     */
    drawBackground() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the menu title.
     */
    drawTitle() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Configuration", this.canvas.width / 2, 130);
    }

    /**
     * Draws the list of control mappings.
     */
    drawControls() {
        this.ctx.font = "28px Arial";
        let y = 180;

        for (const [action, key] of Object.entries(this.controls)) {
            this.ctx.fillText(`${action}: ${key}`, this.canvas.width / 2, y);
            y += 40;
        }
    }

    /**
     * Draws the "Change Character" button.
     */
    drawChangeCharacterButton() {
        const btn = this.changeCharBtn;
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Change Character", this.canvas.width / 2, btn.y + 40);
    }

    /**
     * Handles click events inside the configuration menu.
     * @param {MouseEvent} e - The click event.
     */
    handleClick(e) {
        const { x, y } = this.getClickPosition(e);
        console.log("Pointer:", e.pointerType, x, y);
        if (this.isInsideButton(x, y, this.changeCharBtn)) {
            this.close();
            configureMenu = null;
            world = new Option(this.canvas, this.keyboard);
        }
    }

    /**
     * Converts a mouse event into canvas-relative coordinates.
     * @param {MouseEvent} e - The click event.
     * @returns {{x:number, y:number}} The click position.
     */
    getClickPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    /**
     * Checks whether a point lies inside a button rectangle.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {Object} btn - Button rectangle.
     * @returns {boolean} True if inside the button.
     */
    isInsideButton(x, y, btn) {
        return (
            x > btn.x &&
            x < btn.x + btn.width &&
            y > btn.y &&
            y < btn.y + btn.height
        );
    }

    /**
     * Closes the configuration menu and removes event listeners.
     */
    close() {
        this.active = false;
        this.canvas.removeEventListener("pointerdown", this.boundClickHandler);
    }
}
