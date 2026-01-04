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
    hitEnergy = 5;
    parentArray = null;

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

    /**check if the Moveale Objact has the first Contact ith another Object or have seen preovosly 
     * @param {MoveableObject} mo Movable Object which is checked    */
    checkFirstContact(mo) {
        const dx = (this.x + this.width / 2) - (mo.x + mo.width / 2);
        const dy = (this.y + this.height / 2) - (mo.y + mo.height / 2);

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 550) {
            this.hadFirstContact = true;
        }
    }



    /**IF Object is in the Air over Ground, starts the gravity to ground */
    applyGravity() {
        IntervalManager.setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**check if Object is in the Air or on the Ground */
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

        const touchingRight = a.right >= b.left && a.left < b.left && a.bottom > b.top && a.top < b.bottom;
        const touchingLeft = a.left <= b.right && a.right > b.right && a.bottom > b.top && a.top < b.bottom;
        const touchingTop = a.top <= b.bottom && a.bottom > b.bottom && a.right > b.left && a.left < b.right;
        const touchingBottom = a.bottom >= b.top && a.top < b.top && a.right > b.left && a.left < b.right;
        const collision = touchingRight || touchingLeft || touchingTop || touchingBottom;

        return {
            collision,
            right: touchingRight,
            left: touchingLeft,
            top: touchingTop,
            bottom: touchingBottom
        };
    }

    /**
     * Returns the calculated hitbox boundaries of this object,
     * including all offset adjustments.
     *
     * @returns {{left: number, right: number, top: number, bottom: number}}
     * An object containing the hitbox coordinates.
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
     * Applies damage to the object.
     * @param {number} hitEnergy - Amount of damage to apply.
     * @param {boolean} isDead - Whether the object is already dead.
     */
    hit(hitEnergy, isDead) {
        if (isDead) return;
        this.energy -= hitEnergy;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Returns whether the object is currently in a hurt state.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; //Difference in ms
        timePassed = timePassed / 1000; //Difference in s
        return timePassed < 0.7;
    }

    /**
     * Returns whether the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
    }

    /** Removes this object from its parent array, if assigned. */
    removeFromWorld() {
        clearInterval(this.deathInterval);
        if (this.parentArray) {
            const index = this.parentArray.indexOf(this);
            if (index !== -1) this.parentArray.splice(index, 1);
        }
    }

}