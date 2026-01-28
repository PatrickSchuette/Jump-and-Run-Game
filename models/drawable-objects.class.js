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

    /**
     * Loads a single image and assigns it to the object.
     * @param {string} path - The image file path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object's current image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (!this.img) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the object's bounding box and hitbox for debugging purposes.
     * Only rendered when showDrawFrame is enabled.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this.showDrawFrame) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }

    /**
     * Loads multiple images into the object's image cache.
     * @param {string[]} arr - Array of image file paths.
     */
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

    /**
     * Creates an HTMLAudioElement for sound playback.
     * @param {string} path - The audio file path.
     * @returns {HTMLAudioElement} The created audio object.
     */
    createSound(path) {
        const audio = new Audio(path);
        audio.volume = 0.7;
        return audio;
    }

    /**
     * Plays a sound effect if sound is enabled and the sound is not already playing.
     * @param {HTMLAudioElement} sound - The sound to play.
     */
    playActionSound(sound) {
        if (playSound && sound.paused) {
            sound.currentTime = 0;
            sound.play();
        }
    }
}