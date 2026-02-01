class SpikeWave extends MoveableObject {
    damage = 15;
    moveSpeed = 4;
    lifetime = 5000;
    showDrawFrame = true;

    offset = { top: 120, bottom: 120, left: 40, right: 40 };

    IMAGES = [
        './img/spikes/spikes13.png',
        './img/spikes/spikes12.png',
        './img/spikes/spikes11.png',
        './img/spikes/spikes10.png',
        './img/spikes/spikes9.png',
        './img/spikes/spikes8.png',
        './img/spikes/spikes7.png',
        './img/spikes/spikes6.png',
        './img/spikes/spikes5.png',
        './img/spikes/spikes4.png',
        './img/spikes/spikes3.png',
        './img/spikes/spikes2.png',
        './img/spikes/spikes1.png'
    ];

    constructor(x, groundY, directionLeft) {
        super();

        this.x = x;
        this.y = groundY;
        this.width = 200;
        this.height = 350;

        this.directionLeft = directionLeft;

        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.spawn();
    }

    /**Spawan and animate the Spikes */
    spawn() {
        this.animationInterval = IntervalManager.setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 80, 'SpikeWave:anim');

        this.moveInterval = IntervalManager.setInterval(() => {
            this.x += this.directionLeft ? -this.moveSpeed : this.moveSpeed;
        }, 25, 'SpikeWave:move');

        setTimeout(() => this.removeFromWorld(), this.lifetime);
    }
}
