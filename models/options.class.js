/**
 * Handles the character selection screen.
 */
class Option {

    /**
     * Creates the character selection screen.
     * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
     * @param {Object} keyboard - The keyboard handler instance.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.initCharacters();
        this.loadCharacterImages();
        this.background = new Image();
        this.background.src = "./img/world/Background2.jpg";
        this.boundClickHandler = this.handleClick.bind(this);
        this.canvas.addEventListener("pointerdown", this.boundClickHandler);

        this.draw();
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
     * Handles pointer/touch selection of a character.
     * Converts the pointer position into canvas coordinates and checks
     * whether a character preview was tapped or clicked.
     * @param {PointerEvent} e - The pointer event containing click/touch data.
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        this.characters.forEach(char => {
            if (this.isCharacterClicked(x, y, char)) {
                this.selectCharacter(char.name);
            }
        });
    }
    
    /**
     * Checks whether the given canvas coordinates intersect with a character preview.
     * @param {number} x - X coordinate relative to the canvas.
     * @param {number} y - Y coordinate relative to the canvas.
     * @param {{x:number,y:number,name:string,img:string}} char - Character preview data.
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
     * Saves the selected character to localStorage and switches to the game world.
     * @param {string} name - The identifier of the chosen character.
     */
    selectCharacter(name) {
        localStorage.setItem("selectedCharacter", name);

        // Remove click listener so selection screen is fully disabled
        this.canvas.removeEventListener("pointerdown", this.boundClickHandler);

        world = new World(this.canvas, this.keyboard);
    }

    /**
     * Draws the background image.
     */
    drawBackground() {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the title text.
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
     * Main render loop for the character selection screen.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawTitle();
        this.drawCharacters();

        requestAnimationFrame(() => this.draw());
    }
}
