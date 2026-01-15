class DrawableObject {
    img;
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    speed = 0.15
    imageCache = {};
    currentImage = 0;
    showDrawFrame = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        if (!this.img) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this.showDrawFrame) {

            // Frame of image in blue
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            // Frame of area in red
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );

            ctx.stroke();
        }
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /** 
 * Plays an animation by cycling through image frames. 
 * @param {string[]} images - Array of image paths.
 */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    createSound(path) {
        const audio = new Audio(path);
        audio.volume = 0.7;
        return audio;
    }

playActionSound(sound) {
    if (soundStatus && sound.paused) {
        sound.currentTime = 0;
        sound.play();
    }
}



}