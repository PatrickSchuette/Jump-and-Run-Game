class Configure {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.active = true;

        this.controls = this.loadControls();

        // Change Character Button
        this.changeCharBtn = {
            x: this.canvas.width / 3 - 150,
            y: this.canvas.height - 120,
            width: 300,
            height: 60
        };

        // Checkbox für Hitbox-Anzeige
        this.checkbox = {
            x: this.canvas.width / 3 + 180,
            y: this.canvas.height - 110,
            size: 30
        };

        // Klick-Listener
        this.canvas.addEventListener("click", (e) => this.handleClick(e));

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

        // Checkbox zeichnen
        this.drawCheckbox();

        // Change Character Button zeichnen
        this.drawChangeCharacterButton();

        requestAnimationFrame(() => this.draw());
    }

    drawCheckbox() {
        const cb = this.checkbox;

        // Rahmen
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(cb.x, cb.y, cb.size, cb.size);

        // Haken, wenn aktiv
        if (localStorage.getItem("drawingFrame") === "true") {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(cb.x + 4, cb.y + 4, cb.size - 8, cb.size - 8);
        }

        // Text
        this.ctx.fillStyle = "white";
        this.ctx.font = "28px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Show Hitbox", cb.x + cb.size + 20, cb.y + cb.size - 5);
    }

    drawChangeCharacterButton() {
        const btn = this.changeCharBtn;

        // Hintergrund
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

        // Rahmen
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

        // Text
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Change Character", this.canvas.width / 3, btn.y + 40);
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // --- Change Character Button ---
        const btn = this.changeCharBtn;
        const insideBtn =
            x > btn.x &&
            x < btn.x + btn.width &&
            y > btn.y &&
            y < btn.y + btn.height;

        if (insideBtn) {
            this.active = false;
            configureMenu = null;
            world = new Option(this.canvas, this.keyboard);
            return;
        }

        // --- Checkbox ---
        const cb = this.checkbox;
        const insideCheckbox =
            x > cb.x &&
            x < cb.x + cb.size &&
            y > cb.y &&
            y < cb.y + cb.size;

        if (insideCheckbox) {
            const current = localStorage.getItem("drawingFrame") === "true";
            const next = !current;

            localStorage.setItem("drawingFrame", next ? "true" : "false");

            // World soll neuen Wert nutzen
            if (world && world.ensureDDrawingFrame) {
                world.ensureDDrawingFrame();
            }
        }
    }

    close() {
        this.active = false;
    }
}
