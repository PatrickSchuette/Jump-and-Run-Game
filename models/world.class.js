class World {
    character;
    level = start();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    statusPlayMode;
    statusShowFrame;
    intervals;

    constructor(canvas, keyboard) {
        const selected = localStorage.getItem("selectedCharacter");

        switch (selected) {
            case "knight": this.character = new CharacterKnight(); break;
            case "mage": this.character = new CharacterMage(); break;
            case "rouge": this.character = new CharacterRogue(); break;
            default: this.character = new CharacterKnight();
        }

        this.ensureDDrawingFrame();

        this.statusbarHealth = new HealthStatus();
        this.statusbarCoin = new CoinStatus(this.character);
        this.statusbarBottle = new BottleStatus(this.character);

        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusPlayMode = this.level.playMode;

        this.setWorld();
        this.draw();
        this.run();

        this.intervals = IntervalManager.intervals;

    }

    /**
     * Assigns the world reference to the character, level and all enemies.
     * Ensures that all objects can access world properties such as camera and collisions.
     */
    setWorld() {
        this.character.world = this;
        this.level.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Replaces the current level with a new one.
     * Updates play mode, resets character position and assigns world references.
     * @param {Level} newLevel - The new level instance to load.
     */
    setLevel(newLevel) {
        this.level = newLevel;
        this.statusPlayMode = newLevel.playMode;

        this.character.hadFirstContact = this.statusPlayMode;

        this.level.enemies.forEach(enemy => enemy.world = this);

        this.character.x = 105;
    }

    /**
     * Main rendering loop of the game world.
     * Draws background, clouds, character, enemies, collectables,
     * throwable objects and status bars.
     * Uses requestAnimationFrame for continuous rendering.
     */
    draw() {
        if (this.animationStopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        if (this.statusPlayMode) {
            this.ctx.translate(-this.camera_x, 0);

            this.addToMap(this.statusbarHealth);
            this.addToMap(this.statusbarCoin);
            this.addToMap(this.statusbarBottle);

            const boss = this.endboss();
            if (boss && boss.hadFirstContact) {
                if (!this.statusbarEndboss) {
                    this.statusbarEndboss = new EndbossStatus(boss);
                }
                this.addToMap(this.statusbarEndboss);
            }

            this.ctx.translate(this.camera_x, 0);

            this.addToMap(this.character);
            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.collectables);
            this.addObjectsToMap(this.throwableObjects);
        }
        this.ctx.translate(-this.camera_x, 0)

        self = this;
        requestAnimationFrame(function () {
            self.draw()
        });
    }

    /**
     * Draws an array of drawable objects onto the canvas.
     * @param {DrawableObject[]} objects - The objects to render.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /**
     * Draws a single drawable object onto the canvas.
     * Handles horizontal flipping and optional hitbox rendering.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);

        mo.draw(this.ctx);
        if (this.statusShowFrame) mo.drawFrame(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips the rendering context horizontally for mirrored drawing.
     * @param {DrawableObject} mo - The object being flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the rendering context after a horizontal flip.
     * @param {DrawableObject} mo - The object being restored.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Starts all recurring world logic such as collision checks
     * and throwable object detection.
     * Uses IntervalManager to register intervals.
     */
    run() {
        IntervalManager.setInterval(() => {
            this.checkCollisionCollactable();
            this.checkCollisionEnemy();
            this.checkThrowObjects();
        }, 200, `World:collision-check`);

        IntervalManager.setInterval(() => { this.checkCollisionThrowable(); }, 25, 'World: CheckThrowableObject');
    }

    /**
     * Stops all world activity by clearing intervals and halting rendering.
     */
    stop() {
        this.animationStopped = true;
        IntervalManager.clearAll();
    }

    /**
     * Checks whether the player is throwing a bottle.
     * Spawns a ThrowableObject at the correct position and direction,
     * reduces bottle count and updates the bottle status bar.
     */
    checkThrowObjects() {
        if (this.keyboard.D) {
            if (this.character.collectableObjects.bottle > 0) {

                const hitboxWidth = this.character.width - this.character.offset.left - this.character.offset.right;
                const hitboxHeight = this.character.height - this.character.offset.top - this.character.offset.bottom;
                const centerX = this.character.x + this.character.offset.left + hitboxWidth / 2;
                const centerY = this.character.y + this.character.offset.top + hitboxHeight / 2;

                const throwX = centerX + (this.character.otherDirection ? -40 : 40);
                const throwY = centerY;

                let bottle = new ThrowableObject(throwX, throwY, this.character.otherDirection);
                bottle.parentArray = this.throwableObjects;
                this.throwableObjects.push(bottle);

                this.character.collectableObjects.bottle--;
                this.statusbarBottle.setPercentage(this.character.collectableObjects.bottle);
            }
        }
    }

    /**
     * Checks collisions between the character and all enemies.
     * Handles attack damage, enemy damage, hurt animations
     * and triggers endboss death logic.
     */
    checkCollisionEnemy() {
        this.level.enemies.forEach((enemy) => {
            this.checkDeadEndboss(enemy)
            const col = this.character.isColliding(enemy);

            if (col.collision) {
                if (this.character.isAttacking && !enemy.dead) {
                    enemy.hit(this.character.hitEnergy, enemy.dead);
                }

                else if (!enemy.dead) {
                    this.character.hit(enemy.hitEnergy, enemy.dead);
                    this.statusbarHealth.setPercentage(this.character.energy);
                }
            }

            enemy.checkFirstContact(this);
        });
    }

    /**
     * Checks whether the given enemy is an endboss and has died.
     * If so, switches the world to the win screen.
     *
     * @param {enemy} enemy - The enemy to check.
     */
    checkDeadEndboss(enemy) {
        if (!(enemy instanceof Endboss)) return;
        if (enemy.dead) this.setLevel(win());
    }

    /**
     * Checks collisions between throwable objects and enemies.
     * Applies damage, removes bottles on impact and triggers enemy death.
     */
    checkCollisionThrowable() {
        this.throwableObjects.forEach((bottle) => {

            this.level.enemies.forEach((enemy) => {

                if (bottle.isColliding(enemy).collision) {
                    enemy.hit(bottle.hitEnergy, enemy.dead);
                    if (enemy.energy <= 0) {
                        enemy.dead = true;
                    }
                    bottle.removeFromWorld();
                }

                enemy.checkFirstContact(this);
            });
        });
    }

    /**
     * Handles collection of coins or bottles.
     * Increases the character's inventory and updates the status bar.
     * @param {MoveableObject} obj - The collectable object.
     * @param {string} type - The inventory type ("coin" or "bottle").
     * @param {number} max - Maximum allowed amount.
     * @param {StatusBar} statusbar - The status bar to update.
     */
    handleCollect(obj, type, max, statusbar) {
        if (this.character.collectableObjects[type] < max) {
            this.character.collectableObjects[type]++;
            statusbar.setPercentage(this.character.collectableObjects[type]);
            obj.removeFromWorld();
        }
    }

    /**
     * Checks collisions between the character and all collectable objects.
     * Handles coin and bottle pickup.
     */
    checkCollisionCollactable() {
        this.level.collectables.forEach((obj) => {
            if (this.character.isColliding(obj).collision) {
                if (obj instanceof CollectableBottle) this.handleCollect(obj, "bottle", this.character.collectableObjects.maxBottle, this.statusbarBottle);
                if (obj instanceof CollectableCoin) this.handleCollect(obj, "coin", this.character.collectableObjects.maxCoin, this.statusbarCoin);
            }
        });
    }

    /**
     * Returns the endboss instance of the current level, if present.
     * @returns {Endboss|undefined} The endboss or undefined if none exists.
     */
    endboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
    }

    /**
     * Resumes world rendering and interval logic after a pause.
     */
    resume() {
        this.animationStopped = false;
        this.draw();
        this.run();
    }

    /**
     * Loads the hitbox drawing setting from localStorage
     * and updates the world state accordingly.
     */
    ensureDDrawingFrame() {
        let existing = localStorage.getItem("drawingFrame");

        if (existing === null) {
            localStorage.setItem("drawingFrame", "false");
            existing = "false";
        }

        this.statusShowFrame = (existing === "true");
    }


}