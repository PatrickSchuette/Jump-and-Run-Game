class Option {

    constructor(canvas, keyboard) {
        this.keyboard = keyboard;

        this.initCanvas(canvas);
        this.initCharacters();
        this.loadCharacterImages();

        this.background = new Image();
        this.background.src = "./img/world/Background2.jpg";

        this.registerEvents();
        this.startRenderLoop();
    }

    /**
     * Initializes canvas and rendering context.
     * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
     */
    initCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Creates the list of selectable characters.
     */
    initCharacters() {
        this.characters = [
            { name: "knight", img: "./img/character/Knight/knight.png", x: 100, y: 150 },
            { name: "mage", img: "./img/character/Mage/mage.png", x: 260, y: 150 },
            { name: "rouge", img: "./img/character/Rogue/rogue.png", x: 400, y: 150 }
        ];
    }

    /**
     * Loads all character preview images into memory.
     */
    loadCharacterImages() {
        this.characters.forEach(char => {
            const img = new Image();
            img.src = char.img;
            char.image = img;
        });
    }

    /**
     * Registers all event listeners for character selection.
     */
    registerEvents() {
        this.registerClick();
    }

    /**
     * Starts the continuous rendering loop.
     */
    startRenderLoop() {
        this.draw();
    }


    /**
     * Loads all character preview images into memory.
     */
    loadImages() {
        this.characters.forEach(char => {
            const img = new Image();
            img.src = char.img;
            char.image = img;
        });
    }

    /**
     * Determines whether the click position intersects with a character preview.
     * @param {number} x - Click x-coordinate.
     * @param {number} y - Click y-coordinate.
     * @param {Object} char - Character object with position and size.
     * @returns {boolean} True if the character was clicked.
     */
    isCharacterClicked(x, y, char) {
        return (
            x > char.x &&
            x < char.x + 200 &&
            y > char.y &&
            y < char.y + 200
        );
    }

    /**
     * Saves the selected character and switches to the game world.
     * @param {string} name - The selected character name.
     */
    selectCharacter(name) {
        localStorage.setItem("selectedCharacter", name);
        world = new World(this.canvas, this.keyboard);
    }

    /**
     * Registers click detection for character selection.
     */
    registerClick() {
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.characters.forEach(char => {
                if (this.isCharacterClicked(x, y, char)) {
                    this.selectCharacter(char.name);
                }
            });
        });
    }

    /**
     * Draws the background image.
     */
    drawBackground() {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the title text for the character selection screen.
     */
    drawTitle() {
        this.ctx.font = "32px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Please select your character", this.canvas.width / 2, 80);
    }

    /**
     * Draws all character preview images and labels.
     */
    drawCharacters() {
        this.characters.forEach(char => {
            this.ctx.drawImage(char.image, char.x, char.y, 150, 150);

            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.fillText(char.name.toUpperCase(), char.x + 80, char.y + 180);
        });
    }

    /**
     * Continuously renders the character selection screen including
     * background, title and character previews.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawTitle();
        this.drawCharacters();

        requestAnimationFrame(() => this.draw());
    }

}
