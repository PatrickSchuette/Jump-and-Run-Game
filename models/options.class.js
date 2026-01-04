class Option {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.background = new Image(); 
        this.background.src = "./img/world/Background2.jpg";

        this.characters = [
            { name: "knight", img: "./img/character/Knight/knight.png", x: 100, y: 150 },
            { name: "mage",   img: "./img/character/Mage/mage.png",   x: 260, y: 150 },
            { name: "rouge", img: "./img/character/Rogue/rogue.png", x: 400, y: 150 }
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
                    localStorage.setItem("selectedCharacter", char.name);

                    world = new World(this.canvas, this.keyboard);
                }
            });
        });
    }

draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "32px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Please select your character", this.canvas.width / 2, 80);

    this.characters.forEach(char => {
        this.ctx.drawImage(char.image, char.x, char.y, 150, 150);

        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(char.name.toUpperCase(), char.x + 80, char.y + 180);
    });

    requestAnimationFrame(() => this.draw());
}


}
