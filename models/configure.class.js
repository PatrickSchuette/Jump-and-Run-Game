class Configure {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.active = true;

        this.controls = this.loadControls();

        this.draw();
    }

    loadControls() {
        const raw = localStorage.getItem("controls");

        if (!raw) {
            return {
                Left: "LEFT",
                Right: "RIGHT",
                Jump: "SPACE",
                Fight: "F",
                Throw: "D"
            };
        }

        try {
            return JSON.parse(raw);
        } catch (e) {
            console.warn("Controls konnten nicht gelesen werden:", e);
            return {};
        }
    }

    draw() {
        if (!this.active) return;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Configuration", this.canvas.width / 2, 100);

        this.ctx.font = "28px Arial";
        let y = 180;

        for (const [action, key] of Object.entries(this.controls)) {
            this.ctx.fillText(`${action}: ${key}`, this.canvas.width / 2, y);
            y += 40;
        }

        requestAnimationFrame(() => this.draw());
    }

    close() {
        this.active = false;
    }
}
