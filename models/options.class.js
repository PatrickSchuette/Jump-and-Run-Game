class Option {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.characters = [
            { name: "knight", img: "../img/character/Knight/knight.png", x: 100, y: 200 },
            { name: "mage",   img: "../img/character/Mage/mage.png",   x: 250, y: 200 },
            { name: "rouge", img: "../img/character/Rogue/rogue.png", x: 400, y: 200 }
        ];

        this.loadedImages = [];

        this.loadImages();
        this.registerClick();
        this.draw();
    }

    loadImages() {
        this.characters.forEach(char => {
            const img = new Image();
            img.src = char.img;
            char.image = img;
        });
    }

    registerClick() {
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.characters.forEach(char => {
                if (
                    x > char.x && x < char.x + 200 &&
                    y > char.y && y < char.y + 200
                ) {
                    // Charakter speichern
                    localStorage.setItem("selectedCharacter", char.name);

                    // Spiel starten
                    world = new World(this.canvas, this.keyboard);
                }
            });
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.characters.forEach(char => {
            this.ctx.drawImage(char.image, char.x, char.y, 200, 200);
        });

        requestAnimationFrame(() => this.draw());
    }
}
