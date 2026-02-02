class MoveableObject extends DrawableObject {

    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundY = 100;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    energy = 100;
    lastHit = 0;
    hadFirstContact = false;
    hitPosition = {
        top: true,
        bottom: true,
        left: true,
        right: true
    }
    dead = false;
    hitEnergy = 15;
    throwEnergy = 25;
    parentArray = null;
    distanceEnemy = null;

    constructor() {
        super();
        this.loadImage('./img/ball-energy.png');
    }

    /** move moveable Object to the right Direction */
    moveRight() {
        if (this.hadFirstContact) this.x += this.speed;
    }

    /** move moveable Object to the right Direction */
    moveLeft() {
        if (this.hadFirstContact) this.x -= this.speed;
    }

    /**
     * Checks whether the object has entered the visible camera area.
     * Once visible, the object becomes active (hadFirstContact = true).
     * @param {World} world - The current game world instance.
     */
    checkFirstContact(world) {
        const cameraLeft = world.camera_x * -1;
        const cameraRight = cameraLeft + world.canvas.width;

        const enemyCenter = this.x + this.width / 2;

        if (enemyCenter > cameraLeft && enemyCenter < cameraRight) {
            this.hadFirstContact = true;
        }
    }

    /**
     * Applies gravity to the object by repeatedly adjusting its vertical
     * position and vertical speed. Runs in an interval until the object
     * reaches the ground.
     */
    applyGravity() {
        IntervalManager.setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25, 'MovableObject: Gravity', 'character');
    }

    /**
     * Determines whether the object is currently above the ground.
     * Throwable objects are always considered above ground.
     * @returns {boolean} True if the object is in the air.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundY;
        }
    }

    /**
     * Checks whether this object is colliding with another MoveableObject.
     * Collision is detected based on hitbox overlap and directional contact.
     *
     * @param {MoveableObject} mo - The other object to check collision against.
     * @returns {{
     *   collision: boolean,
     *   right: boolean,
     *   left: boolean,
     *   top: boolean,
     *   bottom: boolean
     * }}
     * An object describing whether a collision occurred and from which side.
     */
    isColliding(mo) {
        const a = this.getHitbox();
        const b = mo.getHitbox();
        const collision = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        return {
            collision,
            character: {
                fromRight: a.right > b.left && a.left < b.left,
                fromLeft: a.left < b.right && a.right > b.right,
                fromTop: a.bottom <= b.top,
                fromBottom: a.top >= b.bottom
            },
            enemy: {
                fromRight: b.right > a.left && b.left < a.left,
                fromLeft: b.left < a.right && b.right > a.right,
                fromTop: b.bottom <= a.top,
                fromBottom: b.top >= a.bottom
            }
        };
    }

    /**
     * Computes the object's hitbox boundaries including offset adjustments.
     * @returns {{left:number, right:number, top:number, bottom:number}}
     * The hitbox coordinates.
     */
    getHitbox() {
        return {
            left: this.x + this.offset.left,
            right: this.x + this.width - this.offset.right,
            top: this.y + this.offset.top,
            bottom: this.y + this.height - this.offset.bottom
        };
    }

    /**
     * Applies damage to the object. If energy reaches zero, the object dies.
     * @param {number} hitEnergy - Amount of damage to apply.
     * @param {boolean} dead - Whether the object is already dead.
     */
    hit(hitEnergy, dead) {
        if (dead) return;
        this.energy -= hitEnergy;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object is currently in a hurt state.
     * Hurt state lasts for 0.7 seconds after the last hit.
     * @returns {boolean} True if the object is still hurt.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; 
        timePassed = timePassed / 1000; 
        return timePassed < 0.7;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean} True if the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Removes the object from its parent array and clears its death interval.
     * Used for enemies, projectiles and collectables.
     */
    removeFromWorld() {
        clearInterval(this.deathInterval);
        if (this.parentArray) {
            const index = this.parentArray.indexOf(this);
            if (index !== -1) this.parentArray.splice(index, 1);
        }
    }

}